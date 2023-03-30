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
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.auth.transport import requests as google_auth_requests
import requests
import google.oauth2.credentials
import google_auth_oauthlib.flow
from google.oauth2.id_token import verify_oauth2_token
from django.db.models.functions import TruncMonth
from django.db.models import Count

from rest_framework import filters
from api.permissions import IsSuperuser


# Login Class with JWT
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoginSerializer


class LogoutView(views.APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        refresh_token = request.data.get("refresh")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Registration Class
class RegisterView(views.APIView):
    

    def post(self, request, format=None):
        print(request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Video Upload

class VideoUploadView(CreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


    
class VideoList(ListAPIView):
    queryset = Video.objects.filter(is_approved=True, is_deleted=False)
    serializer_class = VideoSerializer

class GenreList(ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class UserVideoCount(APIView):
    authentication_classes = (JWTAuthentication,)
    def get(self, request):
        
        try:
            video_count = Video.objects.filter(user=request.user).count()
            return Response({'video_count':video_count }, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Could not retrieve user count'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UserVideoList(ListAPIView):
    authentication_classes = (JWTAuthentication,)
    serializer_class = VideoSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Video.objects.filter(user=user, is_deleted=False)
    
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
    
class ChangePasswordView(UpdateAPIView):

    queryset = Account.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer
    
class SearchVideoList(ListAPIView):
    serializer_class = VideoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'genres__genre_name']

    def get_queryset(self):
        return Video.objects.filter(is_approved=True, is_deleted=False)


class AdminHomeView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    def get(self, request):
        
        try:
            user_count = Account.objects.count()
            video_count = Video.objects.count()
            return Response({'user_count': user_count,
                            'video_count':video_count }, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Could not retrieve user count'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class NotificationList(ListAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


class AdminUserList(ListAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Account.objects.all()
    serializer_class = UserSerializer

class AdminVideoApproval(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)

    def post(self, request):
      try:

        id = request.data.get('id')
        print(id)
        video = Video.objects.get(id=id)
        video.is_approved = False if video.is_approved else True
        video.save()

        return Response({'message': "Video has been approved"}, status=status.HTTP_200_OK)
    
      except:
        
        return Response({'error': 'Could not retrieve the video details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
class AdminUserBlock(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)

    def post(self, request):
        try:
            id = request.data.get('id')
            user = Account.objects.get(id=id)
            user.is_active = False if user.is_active else True
            print(user.is_active)
            user.save()
            return Response({'message': "User has been blocked"}, status=status.HTTP_200_OK)
        except Account.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Could not retrieve the user details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
class AdminVideoList(ListAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Video.objects.all()
    serializer_class = VideoListSerializer

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
    
class AdminAddGenre(CreateAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)

    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class AdminDeletedList(ListAPIView):
    queryset = Video.objects.filter(is_deleted=True)
    serializer_class = VideoSerializer

class AdminDeleteVideo(DestroyAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

class AdminDeleteGenre(DestroyAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class DeleteNotification(DestroyAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsSuperuser)
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class AdminChartData(APIView):
    def get(self, request, format=None):
        user_count = (
            Account.objects
            .annotate(month=TruncMonth('date_joined'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
            .values_list('count', flat=True)
        )

        video_count = (
            Video.objects
            .annotate(month=TruncMonth('uploaded_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
            .values_list('count', flat=True)
        )

        months = (
            Account.objects
            .annotate(month=TruncMonth('date_joined'))
            .values('month')
            .order_by('month')
            .distinct()
            .values_list('month', flat=True)
        )

        data = {
            'userCount': list(user_count),
            'videoCount': list(video_count),
            'months': [month.strftime('%B %Y') for month in months],
        }

        return Response(data)


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




    
    

    
