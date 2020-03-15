from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
from django.core.validators import RegexValidator


class Profile(models.Model):
    alphanumeric = RegexValidator(
        r'^[0-9a-zA-Z ]*$', 'Only alphanumeric characters are allowed.')
    letters = RegexValidator(r'^[a-zA-Z ]*$', 'Only letters are allowed.')

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile')
    join_timestamp = models.DateField(blank=True)
    alias = models.CharField(max_length=50, blank=True,
                             validators=[alphanumeric])
    name = models.CharField(max_length=60, blank=True,
                            null=True, validators=[letters])
    profile_img = models.ImageField(
        default='default_profile_pic.jpg', upload_to='profile_pics')
    background_img = models.ImageField(
        default='default_background_pic.jpg', upload_to='background_pics')
    description = models.TextField(blank=True, max_length=300)
    following = models.ManyToManyField(
        'self', related_name='followers', blank=True)

    def __str__(self):
        return f'Profile [User:{self.user.username},ID:{self.user.id}]'

    def get_absolute_url(self):
        return reverse('users:profile', kwargs={'pk': self.pk})

    def get_update_profile_url(self):
        return reverse('users:profile_update', kwargs={'pk': self.pk})
