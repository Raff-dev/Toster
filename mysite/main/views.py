from django.shortcuts import render
from post.models import Post
from post.forms import PostForm
# Create your views here.


def main(request):
    most_recent = Post.objects.filter(parent=None).order_by('-timestamp')[:8]
    posts_all = Post.objects.filter(parent=None).order_by('-timestamp')
    context = {
        'most_recent': most_recent,
        'post_form': PostForm,
        'posts_all': posts_all,
    }

    return render(request, 'main/home.html', context)
