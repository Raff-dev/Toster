from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile


class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(
        label="E-mail")

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


class ProfileUpdateForm(forms.ModelForm):
    alias = forms.CharField(required=False, max_length=50,)
    profile_img = forms.ImageField(required=False)
    name = forms.CharField(required=False, max_length=60,)
    description = forms.CharField(required=False, max_length=360, )

    class Meta:
        model = Profile
        fields = ['alias', 'profile_img', 'name', 'description', ]
