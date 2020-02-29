from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import (
    DetailView, CreateView, ListView, FormView, DeleteView, UpdateView)
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse

from .forms import UserRegisterForm, ProfileUpdateForm
from django.contrib.auth.models import User
from .models import Profile
from post.models import Post


def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            return redirect('main:main')
    else:
        form = UserRegisterForm()
    return render(request, 'users/register.html', {'form': form})


class ProfileView(DetailView):
    model = Profile
    template_name = 'users/profile.html'

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)
        profile = get_object_or_404(Profile, pk=self.kwargs['pk'])
        user = get_object_or_404(User, profile=profile)
        context['posts'] = Post.objects.filter(
            author=user).order_by('-timestamp')[:5]
        context['update_form'] = ProfileUpdateForm
        return context


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
        print('//--------------------------------------------------------------------------------')
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
