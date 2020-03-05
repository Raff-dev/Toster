from django.urls import path, include
from django.views.generic import TemplateView
from .views import (PostDetailView, PostCreateView,
                    PostUpdateView, PostDeleteView, PostTemplate)
from .api.views import (PostLikeAPIToggle, PostsLiked,
                        PostDataApi, PostViewSet)
from .api.router import router

app_name = 'post'

urlpatterns = [
    path('detail/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('update/<int:pk>/', PostUpdateView.as_view(), name='post_update'),
    path('delete/<int:pk>/', PostDeleteView.as_view(), name='post_delete'),
    path('like_api/<int:pk>/', PostLikeAPIToggle.as_view(),
         name='post_like_api'),
    path('posts_liked/', PostsLiked.as_view(), name='posts_liked'),
    path('create/', PostCreateView.as_view(), name='post_create'),

    path('api/', include(router.urls), name='api'),
    path('data_api/', PostDataApi.as_view(), name='post_data_api'),

    # templates
    path('post_template/<int:pk>', PostTemplate.as_view(),
         name='post_template'),
]

for url in router.urls:
    print(url)
