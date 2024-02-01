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
    prompt = f"""
Most speech-to-text models & services fall short in recognizing proper nouns.
Most speech-to-text models transcribe phonetically-similar gibberish in place of the proper noun.

Your job is to be a proper-noun correction system, and identify potential nouns that don't make sense grammatically in the transcription. You are to identify potential phrases or words in the transcription that don't make sense in the context of the video.

Your input is the following: 

Title: "{title}"

Description: "{description}"

Transcription: "{text}

Return your answer in the form of the full original transcription, but augment it by surrounding problematic phrases with {{<problem phrase>}}[<reason why problematic>]:"""

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
