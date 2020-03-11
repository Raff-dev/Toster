from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import authentication, permissions, viewsets
from rest_framework.decorators import action

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .serializers import PostSerializer, UsersSerializer
from post.models import Post, PostImage


class PostViewSet(viewsets.GenericViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    #permission_classes = {permissions.IsAuthenticated}
    #authentication_classes = (authentication.TokenAuthentication,)

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
        print('POST::', request.POST)
        print('FILES::', request.FILES)

        data = request.data.copy()
        data['timestamp'] = timezone.now()
        data['author'] = self.request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        new_post = Post.objects.get(pk=serializer.data['id'])
        for img in request.FILES.values():
            img = PostImage(post=new_post, image=img)
            img.save()

            print(new_post.images.all())
        if serializer.data['parent']:
            parent_id = serializer.data['parent']
            parent = Post.objects.get(pk=parent_id)
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
        post = get_object_or_404(Post, pk=self.kwargs.get('pk'))
        user = self.request.user
        if request.method == 'POST':
            if user in post.likes.all():
                post.likes.remove(user)
                liked = False
            else:
                post.likes.add(user)
                liked = True
            return Response({'liked': liked, 'id': post.id})
        return Response(user in post.likes.all())

    @action(methods=['get'], detail=True)
    def comments_ids(self, request, format=None, *args, **kwargs):
        """
        return a list of comments ids
        """
        comments = Post.objects.all().filter(parent=kwargs.get('pk'))
        return Response([comment.id for comment in comments])

    @action(methods=['get'], detail=False)
    def posts_ids(self, request, format=None, *args, **kwargs):
        """
        return a list of posts ids with no parent
        """
        posts = Post.objects.all().filter(parent=None).order_by('-timestamp')
        ids = [post.id for post in posts]
        print(ids)
        return Response(ids)

    @action(methods=['post'], detail=True)
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(True)


class UsersViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UsersSerializer

    @action(methods=['get'], detail=True)
    def posts(self, request, format=None, *args, **kwargs):
        instance = self.get_object()
        posts = Post.objects.filter(
            author=instance, parent=None).order_by('-timestamp')
        return Response([post.id for post in posts])

    @action(methods=['get'], detail=True)
    def replies(self, request, format=None, *args, **kwargs):
        instance = self.get_object()
        posts = Post.objects.filter(author=instance).exclude(parent=None)
        return Response([post.id for post in posts])