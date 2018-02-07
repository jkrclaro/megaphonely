from django.urls import reverse_lazy, reverse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView, UpdateView, DeleteView

from .models import Content


class ContentCreate(LoginRequiredMixin, CreateView):
    template_name = 'contents/add.html'
    model = Content
    fields = ('message',)

    def form_valid(self, form):
        content = form.instance
        user = self.request.user
        content.account = user
        response = super(ContentCreate, self).form_valid(form)
        return response


class ContentUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'contents/edit.html'
    model = Content
    fields = ('message',)


class ContentDelete(LoginRequiredMixin, DeleteView):
    template_name = 'contents/delete.html'
    model = Content


class ContentDetail(LoginRequiredMixin, DetailView):
    template_name = 'contents/detail.html'
    model = Content


class ContentList(LoginRequiredMixin, ListView):
    template_name = 'contents/list.html'
    model = Content
