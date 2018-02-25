from django.urls import re_path

from .views import (
    index,
    ContentList, ContentDetail, ContentCreate, ContentUpdate, ContentDelete,
    social_disconnect, SocialList
)

app_name = 'dashboard'

urlpatterns = [
    re_path(r'^$', index, name='index'),
    re_path(r'^contents/$', ContentList.as_view(), name='content_list'),
    re_path(r'^contents/create/$', ContentCreate.as_view(), name='content_add'),
    re_path(r'^contents/(?P<pk>\d+)/$', ContentDetail.as_view(), name='content_detail'),
    re_path(r'^contents/(?P<pk>\d+)/edit/$', ContentUpdate.as_view(), name='content_update'),
    re_path(r'^contents/(?P<pk>\d+)/delete/$', ContentDelete.as_view(), name='content_delete'),
    re_path(r'^socials/$', SocialList.as_view(), name='social_list'),
    re_path(r'^socials/(?P<pk>\d+)/disconnect/$', social_disconnect, name='social_disconnect'),
]

