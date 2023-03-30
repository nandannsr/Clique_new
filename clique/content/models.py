from datetime import datetime
from django.db import models
from accounts.models import Account
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Create your models here.
class Genre(models.Model):
    genre_name = models.CharField(max_length=50,unique=True)

    def __str__(self):
        return self.genre_name
    
class Video(models.Model):
    user = models.ForeignKey(Account, blank=True, null=True, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    file = models.URLField(max_length=200, blank=True)
    thumbnail = models.URLField(max_length=200, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    progress = models.IntegerField(default=0)
    genres = models.ManyToManyField(Genre)
    is_approved = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    

    def __str__(self):
        return self.title
    
class Notification(models.Model):
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, null=True, blank=True)

    def save(self, *args, **kwargs):
        super(Notification, self).save(*args, **kwargs)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "video_notifications",
            {
                "type": "video_notification",
                "message": self.message
            }
        )
