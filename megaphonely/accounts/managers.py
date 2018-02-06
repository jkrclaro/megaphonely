from django.db import models
from django.core.exceptions import ObjectDoesNotExist

from facepy import GraphAPI


class EmployeeQuerySet(models.QuerySet):
    def is_employed(self, company_id, account_id):
        try:
            return self.get(company__id=company_id, account__id=account_id)
        except ObjectDoesNotExist:
            raise ValueError('Company no longer exists')


class ProfileManager(models.Manager):
    pass


class CompanyManager(models.Manager):
    pass


class EmployeeManager(models.Manager):
    def get_queryset(self):
        return EmployeeQuerySet(self.model, using=self._db)

    def is_employed(self, company_id, account_id):
        return self.get_queryset().is_employed(company_id, account_id)


class SocialManager(models.Manager):

    def _get_twitter_data(self, data):
        return {
            'social_id': data['id'],
            'provider': 'twitter',
            'username': data['screen_name'],
            'fullname': data['name'],
            'picture_url': data['profile_image_url_https'],
            'access_token_key': data['access_token']['oauth_token'],
            'access_token_secret': data['access_token']['oauth_token_secret'],
        }

    def _get_facebook_data(self, data):
        access_token_key = data['access_token']
        graph = GraphAPI(access_token_key)
        response = graph.get('me?fields=picture.width(640)')
        picture_url = response['picture']['data']['url']
        return {
            'social_id': data['id'],
            'provider': 'facebook',
            'username': data['id'],
            'fullname': data['name'],
            'picture_url': picture_url,
            'access_token_key': access_token_key,
        }

    def _get_data(self, provider, data):
        if provider == 'twitter':
            data = self._get_twitter_data(data)
        elif provider == 'facebook':
            data = self._get_facebook_data(data)

        return data

    def _create_or_update(self, company, provider, data):
        updated = False
        try:
            social = self.get(social_id=data['social_id'], provider=provider)
            for column, record in data.items():
                if social.__getattribute__(column) != data[column]:
                    social.__setattr__(column, record)
                    updated = True
            if updated:
                social.save()
        except ObjectDoesNotExist:
            social = self.create(**data)

        social.company.add(company)
        return social

    def upsert(self, company, provider, response):
        data = self._get_data(provider, response)
        model = self._create_or_update(company, provider, data)
        return model
