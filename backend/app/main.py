import asyncio
import os
from enum import StrEnum

import validators
import whisper
from app.extract import process_video
from app.ws import ws_manager
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from openai import OpenAI

load_dotenv()
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError(
        "Ensure OPENAI_API_KEY is set in .env file or environment variables")

client = OpenAI()
whisper_model = whisper.load_model("tiny.en")

app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Allows all origins for simplicity, adjust in production
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


def annotate_transcription(text: str, title: str, description: str):
    prompt = f"""
Most speech-to-text models & services fall short in recognizing proper nouns.
Most speech-to-text models transcribe phonetically-similar gibberish in place of the proper noun.

Your job is to be a proper-noun correction system, and identify potential nouns that don't make sense grammatically in the transcription. You are to identify potential phrases or words in the transcription that don't make sense in the context of the video.

Your input is the following: 

Title: "{title}"

Description: "{description}"

Transcription: "{text}

Return your answer in the form of the full original transcription, but augment it by surrounding problematic phrases with braces in the following form {{<problem phrase>}}[<reason why problematic>]:"""

    completion = client.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "user",
             "content": prompt}
        ],
        temperature=0.7
    )

    print(completion.choices[0].message.content)
    return completion.choices[0].message.content


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


class MessageType(StrEnum):
    DOWNLOAD = "download"
    TRANSCRIBE = "transcribe"
    ANALYZE = "analyze"
    DONE = "done"
    INVALID_URL = "invalid"
    ERROR = "error"


@app.websocket("/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        youtube_url = await websocket.receive_text()
        try:
            validators.url(youtube_url)
            # if neither youtube.com or youtu.be is in the URL, it's not a YouTube URL
            if "youtube.com" not in youtube_url and "youtu.be" not in youtube_url:
                raise Exception("Not a YouTube URL")
        except Exception:
            await ws_manager.send_json({"type": MessageType.INVALID_URL}, websocket)
            return

        print("Working on URL:", youtube_url)

        # Step 1: Downloading the YouTube Video
        await ws_manager.send_json({"type": MessageType.DOWNLOAD}, websocket)
        print("Downloading the YouTube video...")

        loop = asyncio.get_event_loop()

        title, description, mp3_file = await loop.run_in_executor(None, process_video, youtube_url)

        # Step 2: Extracting Audio
        await ws_manager.send_json({"type": MessageType.TRANSCRIBE, "title": title}, websocket)
        print("Extracting transcript from audio...")
        raw_transcription = await loop.run_in_executor(None, whisper_model.transcribe, mp3_file)

        # Remove the mp3 file after extracting the transcript
        os.remove(mp3_file)

        # Step 3: Analyzing transcript
        await ws_manager.send_json({"type": MessageType.ANALYZE, "transcription": raw_transcription["text"]}, websocket)
        print("Analyzing transcript...")
        annotated_transcription = await loop.run_in_executor(None, annotate_transcription,  raw_transcription["text"], title, description)

        # Step 4: Send the annotated transcription
        await ws_manager.send_json(
            {"type": MessageType.DONE, "transcription": annotated_transcription}, websocket)

        # You can process incoming messages here
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
        return


# Run server on localhost:8000
if __name__ == "__main__":
    import os

    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", '8000'))

    uvicorn.run('app.main:app', host=host, port=port, reload=True)
