from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.db import models


class Post(models.Model):
    content = models.TextField(max_length=300)
    author = models.ForeignKey(
        User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    parent = models.ForeignKey(
        'self', related_name='comments', on_delete=models.CASCADE, null=True, blank=True)
    likes = models.ManyToManyField(
        User, related_name='liked', blank=True)

    snippet_length = 350

    def __str__(self):
        if self.parent:
            return f"Post[Author:{self.author}, ID:{self.id}, Parent ID:{self.parent.id}]"
        return f"Post[Author:{self.author}, ID:{self.id}]"

    def get_absolute_url(self):
        return reverse('post:post_detail', kwargs={'pk': self.pk})

    def get_like_api_url(self):
        return reverse('post:post_like_api', kwargs={'pk': self.pk})

    def get_posts_liked_url(self):
        return reverse('post:posts_liked', kwargs={})

    def should_snippet(self):
        return len(self.content) > self.snippet_length

    def snippet(self):
        return self.content[:self.snippet_length]

    def is_comment_reply(self):
        return self.parent.parent is not None


class PostImage(models.Model):
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='post_images')


class Action(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='actions')
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
