from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile


class UserRegisterForm(UserCreationForm):
    from django.core.validators import RegexValidator
    alphanumeric = RegexValidator(
        r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')
    email = forms.EmailField(
        label="E-mail", validators=[alphanumeric])

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


class ProfileUpdateForm(forms.ModelForm):
    alias = forms.CharField(required=False, max_length=16,)
    profile_img = forms.ImageField(required=False)
    name = forms.CharField(required=False, max_length=36,)
    description = forms.CharField(required=False, max_length=36, )

    class Meta:
        model = Profile
        fields = ['alias', 'profile_img', 'name', 'description', ]
