from rest_framework import routers
from .views import PostViewSet, UsersViewSet, ProfileViewSet, HashtagViewSet


router = routers.DefaultRouter()
router.register('post', PostViewSet)
router.register('users', UsersViewSet)
router.register('profile', ProfileViewSet)
router.register('hashtag', HashtagViewSet)
