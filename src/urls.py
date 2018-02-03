from django.contrib import admin
from django.conf.urls import url, include
from django.views.generic import TemplateView


admin.autodiscover()

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^social/', include('social_django.urls', namespace='social'))
]
