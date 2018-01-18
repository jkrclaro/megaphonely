# Generated by Django 2.0.1 on 2018-01-17 18:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contents', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='publisher',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='contents', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
