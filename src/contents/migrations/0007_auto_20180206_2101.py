# Generated by Django 2.0.1 on 2018-02-06 21:01

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('contents', '0006_auto_20180206_2101'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='schedule_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
