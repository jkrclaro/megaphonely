from django.conf import settings
from django.contrib import admin
from django.urls import re_path, path
from django.conf.urls import include, url
from django.views.generic import TemplateView


admin.autodiscover()


urlpatterns = [
    re_path(r'^', include('megaphonely.dashboard.urls', namespace='dashboard')),
    path('privacy', TemplateView.as_view(template_name='legal/privacy.html')),
    path('terms', TemplateView.as_view(template_name='legal/terms.html')),
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^profiles/', include('megaphonely.accounts.urls', namespace='accounts')),
    re_path(r'^accounts/', include('allauth.urls')),
    re_path(r'^social/', include('social_django.urls', namespace='social')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
