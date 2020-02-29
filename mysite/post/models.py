from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.db import models


class Post(models.Model):
    content = models.CharField(max_length=300)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    parent = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True)
    likes = models.ManyToManyField(User, related_name='likes', blank=True)

    snippet_length = 50

    def __str__(self):
        return "%s's post" % self.author

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
