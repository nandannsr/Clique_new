from django.urls import path
from .views import *
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
   # User panel urls
    
    # User login
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # For obtaining new access and refresh tokens
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 

    path('logout/', LogoutView.as_view(), name='logout'), # Logging out
    path('google/', GoogleLogin.as_view(), name='google_login'),# For logging in with google
    path('register/', RegisterView.as_view(), name='register'), # For user register
    path('update/', UserUpdateView.as_view(), name='update'), # Updating user details
    path('upload/',VideoUploadView.as_view(), name='upload'), # For video uploading
    path('videos/',VideoList.as_view(), name='video_list'), # For sending video list to the front end
    path('genres/',GenreList.as_view(), name='genre_list'), # For fetching genre list
    path('search', SearchVideoList.as_view(), name='search'), # For searching the videos
    path('userVideoCount/', UserVideoCount.as_view(), name='video_count'), # For getting the count of user uploaded videos
    path('userVideoList/', UserVideoList.as_view(),), # For fetching the videos uploaded by the user
    path('userDeleteVideo/', UserDeleteVideo.as_view(),), # For soft deleting the video by the user
    path('changePassword/<int:pk>/', ChangePasswordView.as_view(),), # For changing the user password

    # Admin Panel Urls

    path('dashboard',AdminHomeView.as_view(), name='dashboard'), # For Admin Homepage
    path('notifications', NotificationList.as_view(),), # For fetching uploaded video notification
    path('adminUserList', AdminUserList.as_view(),), # For fetching the user list
    path('adminVideoList', AdminVideoList.as_view(),), # For fetching the video list
    path('adminVideoNotify', AdminVideoNotify.as_view(),), #for fetching the video for a particular notification
    path('adminVideoApprove', AdminVideoApproval.as_view(), name='videoApproval'), # For approving uploaded video
    path('adminAddGenre/', AdminAddGenre.as_view()), # For adding different genres
    path('adminDeleteList/', AdminDeletedList.as_view()),# For fetching soft deleted videos
    path('adminDeleteVideo/<int:pk>/delete', AdminDeleteVideo.as_view()),# For permanently deleting a video
    path('adminGenreDelete/<int:pk>/delete', AdminDeleteGenre.as_view()),# For deleting genres
    path('notifDelete/<int:pk>/delete', DeleteNotification.as_view()), # For deleting genres
    path('adminUserBlock/', AdminUserBlock.as_view()), # For blocking an User
    path('chartData/', AdminChartData.as_view()), # For fetching chart data for admin panel
    
    
   
]