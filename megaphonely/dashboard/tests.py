import datetime

from twitter.models import Status
from parameterized import parameterized

from django.test import TestCase

from .tasks import publish_to_facebook, publish_to_twitter

MESSAGE = datetime.datetime.now().strftime('%Y-%m-%d-%s')
IMAGE = 'small.jpg'
VIDEO = 'small.mp4'


class TwitterTasks(TestCase):

    @parameterized.expand([
        ['text', None],
        ['image', IMAGE],
        ['video', VIDEO]
    ])
    def test_publish_to_twitter(self, name, media):
        data = {name: media}
        try:
            del data['text']
        except KeyError:
            pass

        access_token_key = '901476753272655872-PyTYz0nVE7yXn7DqxiOrhCiSHiDZsVo'
        access_token_secret = 'x9HLDX0Jovz9Tmy3WAVoThvn8ORT3DfAcRJXQTZB2ug0p'
        result = publish_to_twitter(access_token_key, access_token_secret,
                                    MESSAGE, **data)
        self.assertEqual(Status, type(result))


class FacebookTasks(TestCase):

    @parameterized.expand([
        ['text', None],
        ['image', IMAGE],
        ['video', VIDEO]
    ])
    def test_publish_to_facebook(self, name, media):
        data = {name: media}
        try:
            del data['text']
        except KeyError:
            pass

        access_token_key = 'EAAY8CZCqoStABAFN1RHBA0DBcBDX4NGXZB5l6EbjXGucQZC5ybSJkeRaGfiUuMcElrJj9Wx7e6MGNtPIZBwWZAtASPBZBYFHw2slxYApRl8zzyR57dQEDZBZCkc1ohUBDsTCwSgscJaXVNlxcsJzwQdLKYkbdTUS9kZBlHhq0cTpwXAZDZD'
        result = publish_to_facebook(access_token_key, MESSAGE, **data)
        self.assertEqual(dict, type(result))
