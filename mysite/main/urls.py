from django.urls import path
from django.contrib.auth.views import LogoutView
from rest_framework.authtoken.views import obtain_auth_token
from . import views

app_name = 'main'

urlpatterns = [
    path('', views.LoginView.as_view(
        template_name='main/main.html'
    ), name='main'),
    path('home/', views.home, name='home'),
    path('token/', obtain_auth_token),
    path('hashtag/<slug:hashtag>', views.hashtagView, name='hashtag'),
    path('login/', views.LoginView.as_view(
        template_name='main/login.html'
    ), name='login'),
    path('logout/', LogoutView.as_view(
        template_name='main/logout.html'
    ), name='logout'),
    path('register/', views.register, name='register'),
]
