from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
# Create your models here.


class Profile(models.Model):
    from django.core.validators import RegexValidator
    alphanumeric = RegexValidator(
        r'^[0-9a-zA-Z ]*$', 'Only alphanumeric characters are allowed.')
    letters = RegexValidator(r'^[a-zA-Z ]*$', 'Only letters are allowed.')

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    join_timestamp = models.DateField()
    alias = models.CharField(max_length=16, blank=True,
                             validators=[alphanumeric])
    name = models.CharField(max_length=36, blank=True,
                            null=True, validators=[letters])
    profile_img = models.ImageField(
        default='default_profile_pic.jpg', upload_to='profile_pics')
    description = models.TextField(blank=True, max_length=300)
    following = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name='following')
    followers = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name='followers')

    def __str__(self):
        return f'{self.user.username} Profile'

    def get_absolute_url(self):
        return reverse('users:profile', kwargs={'pk': self.pk})

    def get_update_profile_url(self):
        return reverse('users:profile_update', kwargs={'pk': self.pk})
