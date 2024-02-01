import os

from moviepy.editor import AudioFileClip
from pytube import YouTube

OUTPUT_DIR = "out"


def process_video(link: str):
    """
    Download the audio from a YouTube video and convert it to mp3
    Return a tuple of the video title, description, and the mp3 file path
    """
    yt = YouTube(link)
    video = yt.streams.filter(only_audio=True).first()
    if video is None:
        raise ValueError("No audio stream found")
    mp4_file = video.download(OUTPUT_DIR)

    # Convert the file to mp3 using moviepy
    audio_clip = AudioFileClip(mp4_file)
    mp3_filepath = f"{OUTPUT_DIR}/{video.title}.mp3"
    audio_clip.write_audiofile(mp3_filepath)
    audio_clip.close()

    # Optionally, delete the original mp4 file after conversion
    os.remove(mp4_file)

    return yt.title, yt.description, mp3_filepath


if __name__ == "__main__":
    link = "https://www.youtube.com/watch?v=zCNrB4wNJUU"
    process_video(link)
