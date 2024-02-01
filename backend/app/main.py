from app.extract import extract_audio_from_video
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

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


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


@app.get("/transcribe")
async def extract_audio(youtube_url: str):
    mp3_file = extract_audio_from_video(youtube_url)
    print("Audio extracted and saved to", mp3_file)

    # Return the audio file
    return "OK"

# Run server on localhost:8000
if __name__ == "__main__":
    import os

    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", '8000'))

    uvicorn.run('app.main:app', host=host, port=port, reload=True)
