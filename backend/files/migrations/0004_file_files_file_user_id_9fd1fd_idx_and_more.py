# Generated by Django 5.1.2 on 2025-06-16 21:55

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0003_alter_file_file'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddIndex(
            model_name='file',
            index=models.Index(fields=['user'], name='files_file_user_id_9fd1fd_idx'),
        ),
        migrations.AddIndex(
            model_name='file',
            index=models.Index(fields=['uploaded'], name='files_file_uploade_8bf7a1_idx'),
        ),
    ]
