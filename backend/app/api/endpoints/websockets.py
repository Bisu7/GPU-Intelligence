from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websockets import manager
import asyncio
from app.services.gpu_monitor import gpu_monitor

router = APIRouter()

@router.websocket("/ws/metrics")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We can either wait for messages or just stream data
            # For now, let's just keep the connection alive
            # The actual streaming will be done via a background task broadcasting to all
            data = await websocket.receive_text()
            # Echo or handle incoming client messages if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)
