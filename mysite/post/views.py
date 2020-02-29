from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import (
    DetailView, CreateView, ListView, FormView, DeleteView, UpdateView)
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.utils import timezone
from .models import Post

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions


class PostDetailView(DetailView):
    model = Post
    template_name = 'post/post_detail.html'


class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ['content']

    def form_valid(self, form):
        form.instance.author = self.request.user
        form.instance.timestamp = timezone.now()
        return super().form_valid(form)


class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Post
    fields = ['content']

    def form_valid(self, form):
        form.instance.author = self.request.user
        print('Post update clean data:', form.cleaned_data)
        print('kwargs', self.kwargs)
        print('request.POST:', self.request.POST)
        print('request.FILES:', self.request.FILES)
        return super().form_valid(form)

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author


class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Post
    template_name = 'post/post_detail.html'
    success_url = '/'

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author


class PostsLiked(APIView):
    def get(self, request, format=None, *args, **kwargs,):
        data = {}
        user = self.request.user
        if user and user.is_authenticated:
            most_recent = Post.objects.order_by('-timestamp')[:8]
            for post in most_recent:
                data[post.id] = True if user in post.likes.all() else False
        return Response(data)


class PostLikeAPIToggle(APIView):
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None, *args, **kwargs,):
        user = self.request.user
        post = get_object_or_404(Post, pk=self.kwargs.get('pk'))
        liked = False

        if user in post.likes.all():
            post.likes.remove(user)
            liked = False
            print('removed user from likes')
        else:
            post.likes.add(user)
            liked = True
            print('added user to likes')
        data = {
            'liked': liked,
        }
        print('data: ', data)
        return Response(data)
