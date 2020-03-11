from rest_framework import routers
from .views import PostViewSet, UsersViewSet


router = routers.DefaultRouter()
router.register('post', PostViewSet)
router.register('users', UsersViewSet)
