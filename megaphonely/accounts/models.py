from django.db import models
from django.conf import settings
from django.urls import reverse
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser

from megaphonely.accounts.managers import ProfileManager


class User(AbstractUser):
    pass


class Profile(models.Model):
    fullname = models.CharField(max_length=100, blank=True, null=True)
    picture = models.FileField(upload_to='profiles', blank=True, null=True)
    newsletter = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)
    objects = ProfileManager()

    class Meta:
        db_table = 'profiles'

    def __str__(self):
        return self.account.username

    def get_screen_name(self):
        return self.fullname if self.fullname else self.account.username

    def get_absolute_url(self):
        return reverse('')

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(account=instance)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()
