import logging
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from dataclasses import dataclass
from typing import Optional, Any

logger = logging.getLogger(__name__)

@dataclass
class TestCaseResult:
    test_number: int
    total_tests: int
    status: str
    input_data: Any
    output: Any
    expected: Any
    execution_time: float
    peak_memory: float
    error_message: Optional[str] = None

    def to_dict(self):
        return {
            "test_case_number": self.test_number,
            "total_test_cases": self.total_tests,
            "status": self.status,
            "input": self.input_data,
            "output": self.output,
            "expected": self.expected,
            "execution_time": self.execution_time,
            "peak_memory": self.peak_memory,
            "error_message": self.error_message
        }

class SolutionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.solution_id = self.scope['url_route']['kwargs']['solution_id']
        self.group_name = f"solution_{self.solution_id}"
        
        logger.info(f"New WebSocket connection for solution {self.solution_id}")
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        logger.info(f"WebSocket disconnected for solution {self.solution_id} with code {close_code}")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_solution_update(self, event):
        try:
            logger.debug(f"Received event for solution {self.solution_id}: {event}")

            # Extraer información del mensaje
            test_info = None
            if event["status"] == "Running":
                test_info = event["message"].match(r"Test case (\d+)/(\d+): (.+)")
            
            message_data = {
                "status": event["status"],
                "message": event["message"],
            }

            # Si tenemos información detallada del test
            if "test_case_result" in event:
                message_data.update(event["test_case_result"])
            # Si no, intentar extraer información básica del mensaje
            elif test_info:
                test_number = int(test_info.group(1))
                total_tests = int(test_info.group(2))
                result = test_info.group(3)
                
                message_data.update({
                    "test_case_number": test_number,
                    "total_test_cases": total_tests,
                    "status": "Passed" if "Passed" in result else "Failed",
                    "error_message": result if "Wrong Answer" in result else None
                })

            await self.send(text_data=json.dumps(message_data))
            logger.debug(f"Sent message to client: {message_data}")

        except Exception as e:
            logger.error(f"Error processing solution update: {str(e)}")
            await self.send(text_data=json.dumps({
                "status": "error",
                "message": str(e)
            }))

# Ejemplo de uso en tu código de ejecución:
"""
await channel_layer.group_send(
    f"solution_{solution_id}",
    {
        "type": "send_solution_update",
        "message_type": "test_case_result",
        "status": "Running",
        "message": f"Test case {test_number}/{total_tests}: {'Passed' if passed else 'Failed'}",
        "test_case_number": test_number,
        "total_test_cases": total_tests,
        "test_status": "Passed" if passed else "Failed",
        "input": test_case.get_formatted_input(),
        "output": formatted_output,
        "expected": test_case.get_formatted_output(),
        "execution_time": execution_time,
        "peak_memory": peak_memory,
        "error_message": error_message if not passed else None
    }
)
"""

