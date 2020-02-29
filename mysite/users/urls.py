from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(
        template_name='users/login.html'
    ), name='login'),
    path('logout/', auth_views.LogoutView.as_view(
        template_name='users/logout.html'
    ), name='logout'),
    path('profile/<int:pk>/', views.ProfileView.as_view(), name='profile'),
    path('profile/update/<int:pk>/',
         views.ProfileUpdateView.as_view(), name='profile_update'),
    path('profile/delete/<int:pk>/',
         views.ProfileDeleteView.as_view(), name='profile_delete'),

]
