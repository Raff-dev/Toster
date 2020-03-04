import json
from django.core import serializers
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import (
    DetailView, CreateView, ListView, FormView, DeleteView, UpdateView, TemplateView)
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .serializers import PostSerializer
from .models import Post
from main.decorators import log_form_data
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions


class PostDetailView(DetailView):
    model = Post
    template_name = 'post/post_detail.html'


class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ['content']

    @log_form_data
    def form_valid(self, form):
        new_post = form.instance

        new_post.author = self.request.user
        new_post.timestamp = timezone.now()

        parent_id = self.request.POST['parent']
        if parent_id:
            parent = Post.objects.get(pk=parent_id)
            print('parent:', parent)
            print('new_post:', new_post)
            new_post.parent = parent
            new_post.save()
            parent.comments.add(new_post)
            parent.save()
        else:
            new_post.parent = None
        return super().form_valid(form)


class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Post
    fields = ['content']

    @log_form_data
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author


class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Post
    template_name = 'post/post_detail.html'
    success_url = '/'

    @log_form_data
    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author


class PostLikeAPIToggle(APIView):
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None, *args, **kwargs,):
        print('IM HEEEREEE')
        user = self.request.user
        post = get_object_or_404(Post, pk=self.kwargs.get('pk'))

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


class PostsLiked(APIView):
    def get(self, request, format=None, *args, **kwargs,):
        data = {}
        user = self.request.user
        if user and user.is_authenticated:
            posts = Post.objects.all()
            for post in posts:
                data[post.id] = user in post.likes.all()
        return Response(data)


class PostDataApi(APIView):
    authentication_classes = (authentication.TokenAuthentication,)

    def post(self, request, format=None, *args, **kwargs):
        print(request.POST)
        query = request.POST['query']
        query_kwargs = request.POST['args']

        response = self.query_dict[query](query_kwargs)
        return Response(response)

    def get_post_list(self, **kwargs):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return serializer

    def get_posts_ids_list(self, **kwargs):
        posts_ids = {}
        posts = Post.objects.all().filter(
            parent=None).order_by('-timestamp')
        count = posts.count()
        print('thats a count: ', count)
        for post, i in zip(posts, range(count)):
            posts_ids[i] = post.id
        # [post.id for post in Post.objects.all().filter(
        # parent = None).order_by('-timestamp')]
        print('posts ids:', posts_ids)
        return posts_ids

    def get_comment_list(self, **kwargs):
        posts_ids = [post.id for post in Post.objects.all().filter(
            parent=kwargs['parent_id']).order_by('-timestamp')]
        print('comments ids:', posts_ids)
        return posts_ids

    query_dict = {
        'posts_ids_list': get_posts_ids_list,
        'comment_list': get_comment_list,
    }


# class PostTemplate(TemplateView):
#     authentication_classes = (authentication.TokenAuthentication,)
#     template_name = 'post/post_template.html'

#     def get_context_data(self, **kwargs):
#         context = super(PostTemplate, self).get_context_data(**kwargs)
#         print(self.request)
#         print(self.request.POST)
#         print(self.request.FILES)
#         print(self.kwargs)
#         print(self.request.method == 'POST')
#         if 'post_id' in self.kwargs:
#             post = get_object_or_404(Post, pk=self.kwargs['post_id'])
#             print(post)
#             context['post'] = post
#         else:
#             print('ERROR: Post id not specified')
#             post = get_object_or_404(Post, pk=113)
#             context['post'] = post
#         return context

class PostTemplate(DetailView):
    model = Post
    template_name = 'post/post_template.html'

    def get_context_data(self, **kwargs):
        print('REQUEST', self.request)
        print('KWARGS', self.kwargs)
        context = super(PostTemplate, self).get_context_data(**kwargs)
        post = get_object_or_404(Post, pk=self.kwargs['pk'])
        print('this should be a post', post)
        if post.parent:
            print('thats a comment')
            context['post'] = post.parent
            context['comment'] = post
        return context
