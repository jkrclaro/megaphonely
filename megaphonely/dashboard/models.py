from django.db import models
from django.urls import reverse
from django.conf import settings

from .managers import ContentManager, SocialManager


class Social(models.Model):
    social_id = models.CharField(max_length=250)
    provider = models.CharField(max_length=30)
    username = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100, blank=True)
    picture_url = models.URLField(blank=True)
    access_token_key = models.TextField(max_length=1000)
    access_token_secret = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    accounts = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)

    objects = SocialManager()

    class Meta:
        unique_together = ('social_id', 'provider',)

    def __str__(self):
        return self.username


class Content(models.Model):
    message = models.TextField()
    multimedia = models.FileField(upload_to='uploads', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    account = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE)

    objects = ContentManager()

    def __str__(self):
        return self.message

    def get_absolute_url(self):
        return reverse('dashboard:content_detail', kwargs={'pk': self.pk})
