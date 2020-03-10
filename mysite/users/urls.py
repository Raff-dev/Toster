from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('profile/<int:pk>/', views.ProfileView.as_view(), name='profile'),
    path('profile/update/<int:pk>/',
         views.ProfileUpdateView.as_view(), name='profile_update'),
    path('profile/delete/<int:pk>/',
         views.ProfileDeleteView.as_view(), name='profile_delete'),

]
