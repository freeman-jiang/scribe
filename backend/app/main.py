import os

import whisper
from app.extract import process_video
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from openai import OpenAI

load_dotenv()
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError(
        "Ensure OPENAI_API_KEY is set in .env file or environment variables")

client = OpenAI()
whisper_model = whisper.load_model("base")

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
    msg = f"You are a speech-to-text correction system. You are to identify potential phrases or words that don't make sense in the given context. You will be given a title, description, and transcription of a video.\n\nGiven the following: \n\nTitle: \"{title}\"\n\nDescription: \"{description}\"\n\nTranscription: \"{text}\"\n\nReturn you answer exactly as the original text, but surround problematic phrases with {{<problem phrase>}}[<reason why problematic>]"
    print(msg)

    completion = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user",
             "content": msg}
        ],
        temperature=0.7
    )

    print(completion)

    print(completion.choices[0].message.content)
    return completion.choices[0].message.content


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


@app.get("/transcribe")
async def extract_audio(youtube_url: str):
    title, description, mp3_file = process_video(youtube_url)
    print(f"Transcribing video: {title}")
    # print("Audio extracted and saved to", mp3_file)
    transcription = whisper_model.transcribe(mp3_file)

    print("Transcription complete, querying OpenAI")
    response = annotate_transcription(
        transcription["text"], title, description)
    # print(f"Transcription complete: {result['text']}")

    os.remove(mp3_file)
    return response


# Run server on localhost:8000
if __name__ == "__main__":
    import os

    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", '8000'))

    uvicorn.run('app.main:app', host=host, port=port, reload=True)
