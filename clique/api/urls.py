from django.urls import path
from .views import *
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('google/', GoogleLogin.as_view(), name='google_login'),

    path('register/', RegisterView.as_view(), name='register'),
    path('update/', UserUpdateView.as_view(), name='update'),
     
    path('upload/',VideoUploadView.as_view(), name='upload'), # For video uploading
    path('videos/',VideoList.as_view(), name='video_list'), #For sending video list to the front end
    path('genres/',GenreList.as_view(), name='genre_list'), #For fetching genre list
    path('search', SearchVideoList.as_view(), name='search'),
    path('userVideoCount/', UserVideoCount.as_view(), name='video_count'),
    path('userVideoList/', UserVideoList.as_view(),),
    path('userDeleteVideo/', UserDeleteVideo.as_view(),),
    path('changePassword/<int:pk>/', ChangePasswordView.as_view(),),

    #Admin Panel Urls
    path('dashboard',AdminHomeView.as_view(), name='dashboard'),
    path('notifications', NotificationList.as_view(),),
    path('adminUserList', AdminUserList.as_view(),),
    path('adminVideoList', AdminVideoList.as_view(),),
    path('adminVideoNotify', AdminVideoNotify.as_view(),),
    path('adminVideoApprove', AdminVideoApproval.as_view(), name='videoApproval'),
    path('adminAddGenre/', AdminAddGenre.as_view()),
    path('adminDeleteList/', AdminDeletedList.as_view()),
    path('adminDeleteVideo/<int:pk>/delete', AdminDeleteVideo.as_view()),
    path('adminGenreDelete/<int:pk>/delete', AdminDeleteGenre.as_view()),
    path('notifDelete/<int:pk>/delete', DeleteNotification.as_view()),
    path('adminUserBlock/', AdminUserBlock.as_view()),
    path('chartData/', AdminChartData.as_view()),
    
    
   
]