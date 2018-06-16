from django.db import models
from django.urls import reverse
from django.conf import settings
from django.utils import timezone

from .choices import SCHEDULES, CATEGORIES
from .managers import ContentManager, SocialManager, TeamManager


class Social(models.Model):
    social_id = models.CharField(max_length=250)
    provider = models.CharField(max_length=30)
    username = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100, blank=True)
    url = models.URLField()
    picture_url = models.URLField(blank=True)
    access_token_key = models.TextField(max_length=1000)
    access_token_secret = models.TextField(blank=True)
    category = models.CharField(max_length=10, choices=CATEGORIES,
                                default='profile')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    account = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE)

    objects = SocialManager()

    class Meta:
        unique_together = ('social_id', 'provider', 'account')

    def __str__(self):
        return self.get_screen_name()

    def get_screen_name(self):
        if self.provider != 'facebook':
            screen_name = self.username
        else:
            screen_name = self.fullname

        return screen_name


class Team(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=40)
    picture = models.FileField(upload_to='teams', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                     related_name='members')

    objects = TeamManager()

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        slugs = {'username': self.account.username, 'team': self.slug}
        return reverse('publisher:team_update', kwargs=slugs)


class Content(models.Model):
    message = models.TextField()
    slug = models.SlugField(max_length=40)
    url = models.URLField(blank=True)
    multimedia = models.ImageField(upload_to='contents', blank=True, null=True)
    schedule = models.CharField(max_length=10, choices=SCHEDULES, default='now')
    is_published = models.BooleanField(default=False)
    schedule_at = models.DateTimeField(default=timezone.now, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    editor = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE, related_name='editor')
    socials = models.ManyToManyField(Social)

    objects = ContentManager()

    def __str__(self):
        return self.message

    def get_absolute_url(self):
        return reverse('publisher:content_detail', kwargs={'pk': self.pk})
