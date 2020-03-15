from django.shortcuts import render, redirect, get_object_or_404
from django.http import Http404
from django.views.generic import (
    DetailView, CreateView, ListView, FormView, DeleteView, UpdateView)
from django.shortcuts import render, redirect
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.urls import reverse

from .forms import ProfileUpdateForm
from .models import Profile
from post.models import Post


def profileView(request, *args, **kwargs):
    username = kwargs['username']
    user = User.objects.filter(username=username).first()
    context = {'exists': False}
    if user:
        profile = user.profile
        context['username'] = username
        context['profile'] = profile
        context['exists'] = True
    return render(request, 'users/profile.html', context)


class ProfileUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Profile
    form_class = ProfileUpdateForm
    template_name = 'users/profile_update.html'

    def form_valid(self, form):
        response = super().form_valid(form)
        print('clean data:', form.cleaned_data)
        print('kwargs:', self.kwargs)
        messages.success(self.request, 'File uploaded!')
        return response

    def test_func(self):
        profile = self.get_object()
        user = self.request.user
        print('request.POST:', self.request.POST)
        print('request.FILES:', self.request.FILES)
        return User.is_authenticated and profile.user == user


class ProfileDeleteView(LoginRequiredMixin, UserPassesTestMixin, DetailView):
    model = Profile
    success_url = '/'

    def test_func(self):
        profile = self.object.get()
        user = self.request.user
        return User.is_authenticated and profile.user == user
