from django.db import models


class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)


class SocialAccountManager(models.Manager):
    def create_social_account(self, social_id, provider, user):
        social_account, created = self.get_or_create(
            social_id=social_id, provider=provider
        )

        if not created:
            social_account.users.add(user)

        return social_account


class SocialAccount(models.Model):
    social_id = models.BigIntegerField(primary_key=True)
    provider = models.CharField(max_length=30)
    users = models.ManyToManyField('auth.User', blank=True)
    objects = SocialAccountManager()

    class Meta:
        unique_together = ('social_id', 'provider')

    def __str__(self):
        return '{provider}: {social_id}'.format(
            provider=self.provider, social_id=self.social_id
        )
