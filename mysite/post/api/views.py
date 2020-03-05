from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import authentication, permissions, viewsets
from rest_framework.decorators import action

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .serializers import PostSerializer
from ..models import Post


class PostLikeAPIToggle(APIView):
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None, *args, **kwargs,):
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
    """
    This class is redundant and its functionality should be
    placed within PostViewSet class.
    """

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


class PostViewSet(viewsets.ModelViewSet):

    # list, create, retrieve, update, partial_update, destroy

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = {permissions.IsAuthenticated}

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'a method':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['timestamp'] = timezone.now()
        data['author'] = self.request.user.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        if serializer.data['parent']:
            parent_id = serializer.data['parent']
            parent = Post.objects.get(pk=parent_id)
            new_post = Post.objects.get(pk=serializer.data['id'])
            print('parent:', parent)
            print('new_post:', new_post)
            new_post.parent = parent
            new_post.save()
            parent.comments.add(new_post)
            parent.save()
        return Response(serializer.data)

    @action(methods=['post', 'get'], detail=True)
    def like(self, request, format=None, *args, **kwargs):
        """
        method used to toggle like attribute and check if a given post is liked
        """
        user = self.request.user
        post = get_object_or_404(Post, pk=self.kwargs.get('pk'))
        if request.method == 'POST':
            if user in post.likes.all():
                post.likes.remove(user)
                liked = False
                print('removed user from likes')
            else:
                post.likes.add(user)
                liked = True
                print('added user to likes')
            return Response({'liked': liked, 'id': post.id})
        return Response(user in post.likes.all())
