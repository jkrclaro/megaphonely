# Generated by Django 2.0.1 on 2018-03-19 21:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_remove_profile_stripe_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='picture',
            field=models.FileField(blank=True, null=True, upload_to='profiles'),
        ),
    ]
