from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path('', views.apiOverview, name='home'),
    path('Entries/', views.getEntries, name='entries'),
    path('Entries/Filter-Entries/<str:tagId>/',
         views.filter_entries, name="filterEntries"),
    path('Tags/', views.getTags, name='tags'),
    path('createTag/', views.createTag, name='createTag'),
    path('updateTag/<str:tagId>/', views.updateTag, name='updateTag'),
    path('deleteTag/<str:tagId>/', views.deleteTag, name='deleteTag'),
    path('createEntry/', views.createEntry, name='createEntry'),
    path('updateEntry/<str:entryId>/',
         views.updateEntry, name='updateEntry'),
    path('deleteEntry/<str:entryId>/', views.deleteEntry, name='deleteEntry'),



    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
