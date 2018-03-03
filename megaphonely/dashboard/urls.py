from django.urls import re_path, path
from django.views.generic import TemplateView

from .views import (
    index,
    ContentList,
    ContentDetail,
    ContentCreate,
    ContentUpdate,
    ContentDelete,
    social_disconnect,
)

app_name = 'dashboard'

urlpatterns = [
    path('', index, name='index'),
    path('connect/', TemplateView.as_view(template_name='socials/connect.html'), name='connect'),
    path('contents/', ContentList.as_view(), name='content_list'),
    path('contents/create/', ContentCreate.as_view(), name='content_add'),
    re_path(r'^contents/(?P<pk>\d+)/$', ContentDetail.as_view(), name='content_detail'),
    re_path(r'^contents/(?P<pk>\d+)/edit/$', ContentUpdate.as_view(), name='content_update'),
    re_path(r'^contents/(?P<pk>\d+)/delete/$', ContentDelete.as_view(), name='content_delete'),
    re_path(r'^socials/(?P<pk>\d+)/disconnect/$', social_disconnect, name='social_disconnect'),
]

