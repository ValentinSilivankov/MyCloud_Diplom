import django.core.validators
import files.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='file',
            field=models.FileField(upload_to=files.models.user_directory_path, validators=[django.core.validators.FileExtensionValidator(['txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'csv', 'bmp', 'jpg', 'jpeg', 'png', 'gif', 'tiff', 'xml', 'mp3'])], verbose_name='Файл'),
        ),
    ]
