from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView as AuthLoginView
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.utils import timezone
from post.models import Post
from post.forms import PostForm
from users.forms import UserRegisterForm
from .models import Hashtag

# Create your views here.


def register(request):
    if request.method == 'POST':
        print(request.POST)
        data = request.POST.copy()
        data['join_timestamp'] = timezone.now()
        form = UserRegisterForm(data)
        if form.is_valid():
            print(form)
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            new_user = authenticate(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
            )
            login(request, new_user)
            return redirect('main:home')
    else:
        form = UserRegisterForm()
    return render(request, 'main/register.html', {'form': form})


class LoginView(AuthLoginView):

    def form_valid(self, form):
        """Security check complete. Log the user in."""
        login(self.request, form.get_user())
        return redirect('main:home')

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('main:home')
        return super(LoginView, self).get(request, *args, **kwargs)


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
    return redirect('main:login')


def hashtagView(request, *args, **kwargs):
    hashtag_name = kwargs['hashtag']
    hashtag = Hashtag.objects.filter(name=hashtag_name).first()
    context = {'exists': False}
    if hashtag:
        context = {
            'hashtag': hashtag,
            'exists': True
        }
    return render(request, 'main/hashtag.html', context)
