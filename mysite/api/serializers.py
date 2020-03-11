from rest_framework import serializers
from django.contrib.auth.models import User
from post.models import Post


class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = '__all__'


class UsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = '__all__'
