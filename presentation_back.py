import asyncio
import socketio
from aiohttp import web
from ollama import AsyncClient

sio = socketio.AsyncServer(cors_allowed_origins='https://medha.cograd.in')
app = web.Application()
sio.attach(app)

CHAT_MODEL = "allrounder"
LESSON_PLAN_MODEL = "llama-lesson"

async def generate_ai_response(prompt, model):
    message = {'role': 'user', 'content': prompt}
    try:
        async for part in await AsyncClient().chat(model=model, messages=[message], stream=True):
            yield part['message']['content']
    except Exception as e:
        print(f"Error in generate_ai_response: {e}")
        yield f"Error: {str(e)}"

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def request(sid, data):
    type = data.get('type')
    prompt = data.get('message')
    if not type or not prompt:
        await sio.emit('error', {"message": "Invalid request format"}, room=sid)
        return

    if type == "chat":
        model = CHAT_MODEL
        language = data.get('language')
        classNumber = data.get('classNumber')
        subject = data.get('subject')
        prompt = f"""You are helpful teacher assistant from India who knows NCEF 2023 well and is helping a teacher for {classNumber} {subject}. Answer the following question:
        {prompt}
        Always answer in {language} using {language}'s script
        """
    elif type == "lesson_plan":
        model = LESSON_PLAN_MODEL
    else:
        await sio.emit('error', {"message": "Invalid request type"}, room=sid)
        return
    print(prompt)
    print(f"Processing {type} request with model {model}")

    try:
        index = 0
        print(index)
        async for response_part in generate_ai_response(prompt, model):
            if index == 0:
                await sio.emit('response', {
                "type": type,
                "content": "[START]"
                }, room=sid)
            await sio.emit('response', {
                "type": type,
                "content": response_part
            }, room=sid)
            index+=1

        await sio.emit('response', {
            "type": type,
            "content": "[DONE]"
        }, room=sid)

        print(f"Completed {type} request")
    except Exception as e:
        print(f"Error processing request: {e}")
        await sio.emit('error', {"message": f"Server error: {str(e)}"}, room=sid)

if __name__ == '__main__':
    web.run_app(app, port=8911)