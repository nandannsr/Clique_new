from rest_framework import views
import jwt
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .serializers import LoginSerializer, VideoListSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from accounts.models import Account
from .serializers import RegisterSerializer, VideoSerializer, GenreSerializer, UserSerializer, NotificationSerializer,ChangePasswordSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from content.models import Video, Genre, Notification
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, DestroyAPIView
from google.auth.transport import requests as google_auth_requests
import google_auth_oauthlib.flow
from google.oauth2.id_token import verify_oauth2_token
from django.db.models.functions import TruncMonth
from django.db.models import Count
from rest_framework import filters
from api.permissions import IsSuperuser


# Login Class with JWT
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoginSerializer


# Define LogoutView class to handle user logout
class LogoutView(APIView):
    # Set authentication and permission classes
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    # Handle HTTP POST requests to the endpoint
    def post(self, request):
        # Extract refresh token from request data
        refresh_token = request.data.get("refresh")
        
        # Create RefreshToken object from the refresh token
        token = RefreshToken(refresh_token)
        
        # Blacklist the token to invalidate it
        token.blacklist()
        
        # Return an HTTP response with a 204 status code indicating success
        return Response(status=status.HTTP_204_NO_CONTENT)

""" User Panel Classes """

# User Registration Class
class RegisterView(views.APIView):
    

    def post(self, request, format=None):
        print(request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# User video upload
class VideoUploadView(CreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# For getting the video list for Home   
class VideoList(ListAPIView):
    queryset = Video.objects.filter(is_approved=True, is_deleted=False)
    serializer_class = VideoSerializer

#For getting the genres in the front end
class GenreList(ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

#For getting the video count for the user
class UserVideoCount(APIView):
    authentication_classes = (JWTAuthentication,)
    def get(self, request):
        
        try:
            video_count = Video.objects.filter(user=request.user).count()
            return Response({'video_count':video_count }, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Could not retrieve user count'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# For getting the uploaded Videos for the user        
class UserVideoList(ListAPIView):
    authentication_classes = (JWTAuthentication,)
    serializer_class = VideoSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Video.objects.filter(user=user, is_deleted=False) # will only fetch the video not deleted by the user

# To soft delete the video by the user  
class UserDeleteVideo(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
      try:

        id = request.data.get('id')
        print(id)
        video = Video.objects.get(id=id)
        video.is_deleted = False if video.is_deleted else True
        video.save()

        return Response({'message': "Video has been deleted"}, status=status.HTTP_200_OK)
    
      except:
        
        return Response({'error': 'Could not retrieve the video details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# For updating the user views
class UserUpdateView(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)
        
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

# For changing the user password 
class ChangePasswordView(UpdateAPIView):

    queryset = Account.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

# For searching the video  
class SearchVideoList(ListAPIView):
    serializer_class = VideoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'genres__genre_name']

    def get_queryset(self):
        return Video.objects.filter(is_approved=True, is_deleted=False)
    
""" End of User Panel Classes """

""" Admin Panel Classes """

# For Admin Homepage
class AdminHomeView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    def get(self, request):
        
        try:
            # For getting the user and video count for the homepage
            user_count = Account.objects.count() 
            video_count = Video.objects.count()
            return Response({'user_count': user_count,
                            'video_count':video_count }, status=status.HTTP_200_OK) 
        except:
            return Response({'error': 'Could not retrieve user count'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# For fetching the notifications
class NotificationList(ListAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

# For fetching the user list
class AdminUserList(ListAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Account.objects.all()
    serializer_class = UserSerializer

# For approving and disapproving the videos uploaded by the users
class AdminVideoApproval(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)

    def post(self, request):
      try:

        id = request.data.get('id')
        print(id)
        video = Video.objects.get(id=id)
        video.is_approved = False if video.is_approved else True # Here the videos are approved or disapproved based on the field value
        video.save()

        return Response({'message': "Video has been approved"}, status=status.HTTP_200_OK)
    
      except:
        
        return Response({'error': 'Could not retrieve the video details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# For blocking and unblocking users     
class AdminUserBlock(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)

    def post(self, request):
        try:
            id = request.data.get('id')
            user = Account.objects.get(id=id)
            user.is_active = False if user.is_active else True # Here the user is blocked or unblocked based on field value
            print(user.is_active)
            user.save()
            return Response({'message': "User has been blocked"}, status=status.HTTP_200_OK)
        except Account.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Could not retrieve the user details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# For fetching the Video List     
class AdminVideoList(ListAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Video.objects.all()
    serializer_class = VideoListSerializer

# For fetching the video based on the notification
class AdminVideoNotify(ListAPIView):

    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    def post(self, request):
        try:
            id = request.data.get('id')
            video = Video.objects.get(id=id)
        except video.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = VideoSerializer(video)
        return Response(serializer.data)

# For adding the Genres   
class AdminAddGenre(CreateAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)

    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

# For fetching the video list for user soft deleted videos
class AdminDeletedList(ListAPIView):
    queryset = Video.objects.filter(is_deleted=True)
    serializer_class = VideoSerializer

# For permanently deleting videos
class AdminDeleteVideo(DestroyAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

# For deleting the genres
class AdminDeleteGenre(DestroyAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

# For deleting the notifications
class DeleteNotification(DestroyAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

# For fetching the Chart data
class AdminChartData(APIView):
    def get(self, request, format=None):
        # Query the database to get the count of users per month
        user_count = (
            Account.objects
            .annotate(month=TruncMonth('date_joined'))  # Extract month from date_joined
            .values('month')
            .annotate(count=Count('id'))  # Count the number of users per month
            .order_by('month')
            .values_list('count', flat=True)  # Extract only the count values
        )

        # Query the database to get the count of videos per month
        video_count = (
            Video.objects
            .annotate(month=TruncMonth('uploaded_at'))  # Extract month from uploaded_at
            .values('month')
            .annotate(count=Count('id'))  # Count the number of videos per month
            .order_by('month')
            .values_list('count', flat=True)  # Extract only the count values
        )

        # Query the database to get the distinct months in which users joined the system
        months = (
            Account.objects
            .annotate(month=TruncMonth('date_joined'))  # Extract month from date_joined
            .values('month')
            .order_by('month')
            .distinct()
            .values_list('month', flat=True)  # Extract only the month values
        )

        # Construct a dictionary containing the fetched data
        data = {
            'userCount': list(user_count),
            'videoCount': list(video_count),
            'months': [month.strftime('%B %Y') for month in months],  # Convert date to string in a human-readable format
        }

        # Return the data as a JSON response
        return Response(data)
    
""" End of Admin Panel Classes """

""" Google User Login """
class GoogleLogin(APIView):

    def post(self, request):
        authorization_code = request.data.get('id')

        flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
                    'D:\Main Project\client_secret_.json',
                    scopes=['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid'],
                    redirect_uri='http://localhost:3000'
                    )

        # flow.redirect_uri = 'http://localhost:3000'
        CLIENT_ID = ''
        credentials = flow.fetch_token(code=authorization_code)
        id_token = credentials['id_token']
        user_info = verify_oauth2_token(id_token, google_auth_requests.Request(), CLIENT_ID)
        print(user_info)
        user_name = user_info['name']
        user_email = user_info['email']
        print(user_name, user_email)
        try:
            user = Account.objects.get(email=user_email)
            serializer = UserSerializer(user)
            print('hello:',serializer.data)
            # If user exists, send access and refresh tokens and user details to front end
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': serializer.data
            })
        except Account.DoesNotExist:
            # If user does not exist, create new user and send access and refresh tokens to front end
            user = Account.objects.create_user(email=user_email, username=user_info['name'], password=None, first_name=user_info['given_name'],
                                               last_name=user_info['family_name'])
            user.save()
            serializer = UserSerializer(user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': serializer.data
            })




    
    

    
