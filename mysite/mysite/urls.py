from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from .settings import DEBUG

urlpatterns = [

    path('', include('main.urls')),
    path('', include('users.urls')),
    path('polls/', include('polls.urls')),
    path('post/', include('post.urls')),
    path('admin/', admin.site.urls, name='admin'),

    # api | to be removed
    # path('api/', include(router.urls)),

]

if DEBUG == True:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
