from rest_framework import serializers
from django.contrib.auth.models import User
from post.models import Post
from users.models import Profile


class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = '__all__'


class UsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'
        lookup_field = 'username'


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'
