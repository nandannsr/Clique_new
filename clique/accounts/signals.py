from django.db.models.signals import post_save
from .models import Account, UserProfile
from django.dispatch import receiver
from content.models import Video, Notification



@receiver(post_save, sender = Account)
def create_profile(sender, instance, created, **kwargs): # To create a user profile when a new user is created
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=Account)
def save_user_profile(sender, instance, **kwargs): # To update the user profile when details of existing user is updated
    instance.userprofile.save()

@receiver(post_save, sender=Video)
def create_notification(sender, instance, created, **kwargs): # To create a new notification whenever a new video is uploaded
    if created:
        message = f'uploaded a new video: {instance.title}'
        notification = Notification.objects.create(message=message, video=instance)
        notification.save()