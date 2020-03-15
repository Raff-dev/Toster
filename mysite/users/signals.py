from django.conf import settings
from rest_framework.authtoken.models import Token
from django.dispatch import receiver
from django.utils import timezone
from django.db.models.signals import pre_save, post_save

from django.contrib.auth.models import User
from .models import Profile


@receiver(pre_save, sender=Profile)
def ensure_alias(sender, instance, **kwargs):
    if not instance.alias:
        instance.alias = instance.user.username


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    print(f'creating profile for user {instance}')
    if created:
        Profile.objects.create(
            user=instance, join_timestamp=timezone.now())


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
