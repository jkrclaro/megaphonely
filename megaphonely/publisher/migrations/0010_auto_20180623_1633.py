# Generated by Django 2.0.1 on 2018-06-23 15:33

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0009_auto_20180623_1629'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='multimedia',
            field=models.FileField(blank=True, null=True, upload_to='contents', validators=[django.core.validators.FileExtensionValidator(('mp4', 'png', 'jpg', 'jpeg', 'gif'))]),
        ),
    ]
