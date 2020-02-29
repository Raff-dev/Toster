from django.shortcuts import render
from post.models import Post
from post.forms import PostForm
# Create your views here.


def main(request):
    most_recent = Post.objects.order_by('-timestamp')[:8]
    context = {
        'most_recent': most_recent,
        'post_form': PostForm,
    }
    return render(request, 'main/home.html', context)
