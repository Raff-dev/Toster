import json
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import (
    DetailView, CreateView, DeleteView, UpdateView,)
from django.shortcuts import get_object_or_404
from django.utils import timezone
from main.decorators import log_form_data
from .models import Post


class PostDetailView(DetailView):
    model = Post
    template_name = 'post/post_detail.html'

    def get_context_data(self, **kwargs):
        context = super(PostDetailView, self).get_context_data(**kwargs)

        post = self.object
        comments = Post.objects.filter(parent=kwargs.get('pk'))

        context['comments'] = comments
        return context


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

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        print('KWARGS', kwargs)
        print('POST', request.POST)
        return super().post(request, *args, **kwargs)


class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Post
    template_name = 'post/post_detail.html'
    success_url = '/'

    @log_form_data
    def test_func(self):
        post = self.get_object()
        user = self.request.user
        return user == post.author or user == self.root_author(post)

    def root_author(self, post):
        parent = post.parent
        while parent.parent:
            parent = parent.parent
        return parent.author


class PostTemplate(DetailView):
    model = Post
    template_name = 'post/post_template.html'

    def get_context_data(self, **kwargs):
        context = super(PostTemplate, self).get_context_data(**kwargs)
        post = get_object_or_404(Post, pk=self.kwargs['pk'])
        context['user'] = self.request.user

        if post.parent:
            self.template_name = 'post/comment_template.html'
            context['post'] = post.parent
            context['comment'] = post
        return context
