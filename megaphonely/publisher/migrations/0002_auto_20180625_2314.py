# Generated by Django 2.0.1 on 2018-06-25 22:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='account',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
