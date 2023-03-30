from django.urls import path

from .consumers import VideoConsumer

websocket_urlpatterns = [
    path('ws/', VideoConsumer.as_asgi()),
]