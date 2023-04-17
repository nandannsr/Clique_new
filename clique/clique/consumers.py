from channels.generic.websocket import AsyncWebsocketConsumer
import json

# For sending the notification to the Admin

class VideoConsumer(AsyncWebsocketConsumer):
    # Called when a client connects to the WebSocket
    async def connect(self):
        # Add the client to the "video_notifications" group
        await self.channel_layer.group_add(
            "video_notifications",
            self.channel_name
        )
        # Accept the WebSocket connection
        await self.accept()

    # Called when a client disconnects from the WebSocket
    async def disconnect(self, close_code):
        # Remove the client from the "video_notifications" group
        await self.channel_layer.group_discard(
            "video_notifications",
            self.channel_name
        )

    # Called when a video notification is sent
    async def video_notification(self, event):
        # Extract the message from the event dictionary
        message = event['message']

        # Send the message to the client as a JSON-encoded text message
        await self.send(text_data=json.dumps({
            'message': message
        }))
