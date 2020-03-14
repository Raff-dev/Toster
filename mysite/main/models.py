from django.db import models
from post.models import Post
from django.core.validators import RegexValidator


class Hashtag(models.Model):
    hashtag_validator = RegexValidator(
        r'^[a-zA-Z_]*[a-zA-Z]+[a-zA-Z_]*$', 'Only letters are allowed.')

    posts = models.ManyToManyField(
        Post, related_name='hashtags', blank=True)
    name = models.CharField(max_length=18, validators=[hashtag_validator])
