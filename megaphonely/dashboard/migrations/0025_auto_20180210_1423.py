# Generated by Django 2.0.1 on 2018-02-10 14:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0024_auto_20180210_0844'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='schedule',
            field=models.CharField(choices=[('now', 'Now'), ('custom', 'Custom')], default='now', max_length=1),
        ),
    ]
