from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.generic import DetailView, CreateView, ListView
from .forms import UserRegisterForm
from post.models import Post
from .models import Profile

def register(request):
    if request.method =='POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            return redirect('main:main')
    else:
        form = UserRegisterForm()
    return render(request, 'users/register.html',{'form': form})



class ProfileView(DetailView):
    model = Profile
    template_name = 'users/profile.html'

    def get_context_data(self, **kwargs):
        context = super(ProfileView,self).get_context_data(**kwargs)
        profile = get_object_or_404(Profile, pk=self.kwargs['pk'])
        user = get_object_or_404(User,profile=profile)
        context['posts'] = Post.objects.filter(author=user).order_by('-timestamp')[:5]
        return context

    


# @login_required()
# def profile(request, username):
#     user = get_object_or_404(User,username = username)
#     context = {
#         'user' : user,
#         }
#     return render(request,'users/profile.html', context)
