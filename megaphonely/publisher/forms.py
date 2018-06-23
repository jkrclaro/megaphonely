from django import forms
from django.template.defaultfilters import filesizeformat
from django.utils.translation import ugettext_lazy as _

from .models import Content, Social

MAX_UPLOAD_SIZE = 5242880


class ContentForm(forms.ModelForm):
    class Meta:
        model = Content
        fields = ['message', 'socials', 'schedule', 'schedule_at', 'multimedia']
        widgets = {
            'message': forms.Textarea(
                attrs={'class': 'form-control',
                       'placeholder': 'What do you want to tell your audience?',
                       'rows': 4, 'cols': 15}
            ),
            'multimedia': forms.FileInput(attrs={'class': 'col-sm-12'}),
            'socials': forms.CheckboxSelectMultiple(
                attrs={'class': 'form-check-input'}
            ),
            'schedule': forms.Select(attrs={'class': 'form-control'}),
            'schedule_at': forms.TextInput(
                attrs={
                    'class': 'datetimepicker-input form-control',
                    'data-target': '#id_schedule_at',
                    'data-toggle': 'datetimepicker'
                }
            )
        }

    def __init__(self, *args, **kwargs):
        account = kwargs.pop('account')
        super(ContentForm, self).__init__(*args, **kwargs)
        socials = Social.objects.filter(account=account)
        self.fields['socials'].queryset = socials

    def clean_multimedia(self):
        multimedia = self.cleaned_data['multimedia']
        if multimedia:
            if multimedia._size > MAX_UPLOAD_SIZE:
                raise forms.ValidationError(
                    _('Please keep filesize under %s. Current filesize %s') %
                    (filesizeformat(MAX_UPLOAD_SIZE),
                     filesizeformat(multimedia._size))
                )
        return multimedia
