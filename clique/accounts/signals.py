from django.db.models.signals import post_save
from .models import Account, UserProfile
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from content.models import Video, Notification
import json

@receiver(post_save, sender = Account)
def create_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=Account)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()

@receiver(post_save, sender=Video)
def create_notification(sender, instance, created, **kwargs):
    if created:
        message = f'uploaded a new video: {instance.title}'
        notification = Notification.objects.create(message=message, video=instance)
        notification.save()