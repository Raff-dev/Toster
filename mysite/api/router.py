from rest_framework import routers
from .views import PostViewSet, UsersViewSet, ProfileViewSet


router = routers.DefaultRouter()
router.register('post', PostViewSet)
router.register('users', UsersViewSet)
router.register('profile', ProfileViewSet)
