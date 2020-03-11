from django.urls import path
from .views import (PostDetailView, PostUpdateView, PostDeleteView,
                    PostTemplate, CommentModalTemplate)

app_name = 'post'

urlpatterns = [
    path('detail/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('update/<int:pk>/', PostUpdateView.as_view(), name='post_update'),
    path('delete/<int:pk>/', PostDeleteView.as_view(), name='post_delete'),
    path('post_template/<int:pk>', PostTemplate.as_view(),
         name='post_template'),
    path('comment_modal_template/<int:pk>', CommentModalTemplate.as_view(),
         name='comment_modal_template'),
]
