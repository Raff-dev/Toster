from django.urls import path
from . import views

app_name = 'post'

urlpatterns = [
    path('detail/<int:pk>/', views.PostDetailView.as_view(), name='post_detail'),
    path('update/<int:pk>/', views.PostUpdateView.as_view(), name='post_update'),
    path('delete/<int:pk>/', views.PostDeleteView.as_view(), name='post_delete'),
    path('like_api/<int:pk>/', views.PostLikeAPIToggle.as_view(), name='post_like_api'),
    path('posts_liked/', views.PostsLiked.as_view(), name='posts_liked'),
    path('create/', views.PostCreateView.as_view(), name ='post_create'),
]


