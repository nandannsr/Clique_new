import json
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import Account
from content.models import Video, Genre, Notification



""" User Serializer with the user's uploaded video count """
class UserSerializer(serializers.ModelSerializer):
    video_count = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = ['first_name', 'username', 'is_superuser', 'phone_number', 'last_name',
                  'email', 'phone_number', 'video_count', 'id', 'is_active']

    def get_video_count(self, user):
        return Video.objects.filter(user=user).count() # For getting the video count

""" User serializer to include the token """
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Account

        fields = ['id', 'username', 'first_name', 'last_name', 'phone_number',
                  'email', 'is_superuser', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

""" For Login with user details """
class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data

""" For user registration """
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=Account.objects.all())]
    )

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Account
        fields = ('password', 'password2', 'email',
                  'first_name', 'last_name', 'phone_number')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = Account.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data['phone_number']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

""" To update the password of the user """
class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Account
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                {"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):

        instance.set_password(validated_data['password'])
        instance.save()

        return instance

""" For fetching the user email in Video Serializer """
class UserVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('email')


class VideoListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'file', 'thumbnail',
                  'uploaded_at', 'progress', 'genres', 'is_approved', 'is_deleted', 'user']

""" For Video upload """
class VideoSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'file',
                  'thumbnail', 'genres', 'is_approved', 'user'] # Here file and thumbail are urls of the file uploaded to the cloud

    def to_internal_value(self, data):
        if isinstance(data.get('genres'), str):
            data['genres'] = json.loads(data['genres']) # To convert the genres data to python object
        return super().to_internal_value(data)

    def create(self, validated_data):
        genres = validated_data.pop('genres', [])
        instance = super().create(validated_data)
        print(' i am here')
        for g in genres:  # For saving the genres sent from the front end
            try:
                print(g, type(g))
                genre = Genre.objects.get(genre_name=g)
            except Genre.DoesNotExist:
                raise serializers.ValidationError(
                    f'Genre "{g}" does not exist')
            instance.genres.add(genre)
        instance.save()
        return instance


""" For serializing the Genres """
class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = ['id', 'genre_name']

""" For serializing the Notifications """
class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = ['id', 'message', 'video']
