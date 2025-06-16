import os
import shutil

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['username']
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),
        ]


@receiver(pre_delete, sender=User)
def auto_delete_user_storage(sender, instance, **kwargs):
    if instance.username:
        storage_path = os.path.join(settings.MEDIA_ROOT, instance.username)
        if os.path.isdir(storage_path):
            shutil.rmtree(storage_path)
