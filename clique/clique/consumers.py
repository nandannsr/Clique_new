from channels.generic.websocket import AsyncWebsocketConsumer
import json

class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "video_notifications",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "video_notifications",
            self.channel_name
        )

    async def video_notification(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))
