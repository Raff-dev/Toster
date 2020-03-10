from django.urls import path, include
from django.views.generic import TemplateView
from .views import (PostDetailView, PostCreateView, PostUpdateView,
                    PostDeleteView, PostTemplate, CommentModalTemplate)
from .api.views import (PostLikeAPIToggle, PostsLiked, PostViewSet)
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

    # templates
    path('post_template/<int:pk>', PostTemplate.as_view(),
         name='post_template'),
    path('comment_modal_template/<int:pk>', CommentModalTemplate.as_view(),
         name='comment_modal_template'),
]

for url in router.urls:
    print(url)
