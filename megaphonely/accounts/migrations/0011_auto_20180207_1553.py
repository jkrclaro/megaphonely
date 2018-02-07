# Generated by Django 2.0.1 on 2018-02-07 15:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0010_auto_20180206_1121'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='company',
            name='accounts',
        ),
        migrations.AddField(
            model_name='company',
            name='employees',
            field=models.ManyToManyField(related_name='employees', through='accounts.Employee', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='company',
            name='owner',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
