# Generated by Django 2.0.1 on 2018-03-09 20:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0007_auto_20180309_2021'),
    ]

    operations = [
        migrations.AddField(
            model_name='social',
            name='category',
            field=models.CharField(choices=[('profile', 'profile'), ('page', 'page'), ('group', 'group'), ('company', 'company')], default='profile', max_length=10),
            preserve_default=False,
        ),
    ]
