from django.shortcuts import render, redirect
from django.contrib.auth.views import (
    LoginView as AuthLoginView, LogoutView as AuthLogoutView)
from django.contrib.auth import login
from django.contrib import messages
from post.models import Post
from post.forms import PostForm

from users.forms import UserRegisterForm
# Create your views here.


def main(request):
    if request.user.is_authenticated:
        return redirect('main:home')
    return render(request, 'main/main.html')


def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            return redirect('main:home')
    else:
        form = UserRegisterForm()
    return render(request, 'users/register.html', {'form': form})


class LoginView(AuthLoginView):

    def form_valid(self, form):
        """Security check complete. Log the user in."""
        login(self.request, form.get_user())
        return redirect('main:home')

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('main:home')
        return super(LoginView, self).get(request, *args, **kwargs)


class LogoutView(AuthLogoutView):
    asd = 5


def home(request):
    if request.user.is_authenticated:
        most_recent = Post.objects.filter(
            parent=None).order_by('-timestamp')[:8]
        posts_all = Post.objects.filter(parent=None).order_by('-timestamp')
        context = {
            'most_recent': most_recent,
            'post_form': PostForm,
            'posts_all': posts_all,
        }
        return render(request, 'main/home.html', context)
    return redirect('users:login')
