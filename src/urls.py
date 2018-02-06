from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls import include, url
from django.views.generic import TemplateView
from django.contrib.auth.decorators import user_passes_test

from src.accounts.views import (CompanyList, CompanyDetail,
                                CompanyCreate, CompanyUpdate, CompanyDelete)
from src.contents.views import (ContentList,  ContentDetail,
                                ContentCreate, ContentUpdate, ContentDelete)
from src.dashboard.views import dashboard_index


admin.autodiscover()

redirect_to_dashboard = user_passes_test(lambda u: u.is_anonymous(), '/dashboard')

urlpatterns = [
    re_path(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    re_path(r'^accounts/', include('allauth.urls')),
    path(r'admin/', admin.site.urls),
    path(r'social/', include('social_django.urls', namespace='social')),

    # Dashboard
    path(r'dashboard/', dashboard_index, name='dashboard'),

    # Socials
    path(r'socials/', TemplateView.as_view(template_name='socials/list.html'), name='social-list'),

    # Contents
    path(r'contents/', ContentList.as_view(), name='content-list'),
    path(r'contents/create/', ContentCreate.as_view(), name='content-add'),
    path(r'contents/<int:pk>/', ContentDetail.as_view(), name='content-detail'),
    path(r'contents/<int:pk>/edit', ContentUpdate.as_view(), name='content-update'),
    path(r'contents/<int:pk>/delete/', ContentDelete.as_view(), name='content-delete'),

    # Companies
    path(r'companies/', CompanyList.as_view(), name='company-list'),
    path(r'companies/create/', CompanyCreate.as_view(), name='company-add'),
    path(r'companies/<int:pk>/', CompanyDetail.as_view(), name='company-detail'),
    path(r'companies/<int:pk>/edit', CompanyUpdate.as_view(), name='company-update'),
    path(r'companies/<int:pk>/delete/', CompanyDelete.as_view(), name='company-delete')
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns