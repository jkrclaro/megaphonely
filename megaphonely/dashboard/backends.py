from social_core.backends.facebook import FacebookOAuth2
from social_core.backends.linkedin import LinkedinOAuth2


class LinkedinOAuth2Team(LinkedinOAuth2):
    name = 'linkedin-oauth2-team'


class FacebookOAuth2Page(FacebookOAuth2):
    name = 'facebook-page'


class FacebookOAuth2Group(FacebookOAuth2):
    name = 'facebook-group'
