import os.path

from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db.models.signals import pre_delete
from django.dispatch import receiver

ACCEPTABLE_EXTENSIONS = [
    'txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'csv',
    'bmp', 'jpg', 'jpeg', 'png', 'gif', 'tiff', 'xml',
    'mp3',
]


def user_directory_path(instance, filename):
    # name, path = get_parts_of_file_name(instance.user, file_name)
    # instance.file_path = path
    # instance.file_name = name
    # return path
    base, ext = os.path.splitext(filename)
    counter = 1
    while True:
        unique_name = f"{base}({counter}){ext}" if counter > 1 else filename
        path = f"{instance.user.username}/{unique_name}"
        if not File.objects.filter(file=path).exists():
            return path
        counter += 1


def get_parts_of_file_name(user, file_name):
    name, extension = os.path.splitext(file_name)
    unique_name = file_name
    counter = 1

    while user.files.filter(file_name=file_name).exists():
        unique_name = f'{name}({counter}){extension}'
        counter += 1

    file_path = f'{user.username}/{unique_name}'
    return unique_name, file_path


class File(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='files',
        verbose_name='Пользователь'
        )
    file = models.FileField(
        upload_to=user_directory_path,
        validators=[FileExtensionValidator(ACCEPTABLE_EXTENSIONS)],
        verbose_name='Файл'
        )
    file_name = models.CharField(blank=True, default='', max_length=255, verbose_name='Имя файла')
    comment = models.TextField(blank=True, default='', verbose_name='Комментарий')
    size = models.PositiveIntegerField(blank=True, verbose_name='Размер')
    uploaded = models.DateTimeField(auto_now_add=True, verbose_name='Дата загрузки')
    downloaded = models.DateTimeField(blank=True, null=True, verbose_name='Дата скачивания')
    special_link = models.CharField(
        blank=True, 
        default='',
        max_length=255,
        unique=True,
        verbose_name='Специальная ссылка'
        )

    def save(self, *args, **kwargs):
        
        # if self.file_name:
        #     self_file_name = '_'.join(self.file_name.split())
        #     original_file_name = '_'.join(os.path.basename(self.file.name).split())
        #     if self_file_name != original_file_name:
        #         new_file_name, _ = os.path.splitext(self.file_name)
        #         _, original_file_extension = os.path.splitext(self.file.name)
        #         new_file_name = f'{new_file_name}{original_file_extension}'
        #         if self.id:
        #             old_full_file_path = self.file.path
        #             file_name, file_path = get_parts_of_file_name(self.user, new_file_name)
        #             self.file_name = file_name
        #             self.file.name = file_path
        #             new_full_file_path = os.path.join(settings.MEDIA_ROOT, self.file.name)
        #             os.rename(old_full_file_path, new_full_file_path)
        #         else:
        #             self.file.name = new_file_name

        # self.size = self.file.size
        # super().save(*args, **kwargs)

        if not self.pk:
            self.size = self.file.size
            self.file_name = os.path.basename(self.file.name)

            if not self.file.name.startswith(self.user.username):
                self.file.name = f"{self.user.username}/{self.file.name}"

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Файл'
        verbose_name_plural = 'Файлы'
        ordering = ['user', '-uploaded']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['uploaded']),
        ]


@receiver(pre_delete, sender=File)
def auto_delete_file_from_storage(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)
