from channels.generic.websocket import AsyncWebsocketConsumer
import json

class SolutionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.solution_id = self.scope['url_route']['kwargs']['solution_id']
        self.group_name = f"solution_{self.solution_id}"

        # Únete al grupo del WebSocket
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Sal del grupo
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_solution_update(self, event):
        # Envía el mensaje de progreso al cliente
        await self.send(text_data=json.dumps({
            "status": event["status"],
            "message": event["message"],
        }))

