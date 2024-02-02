import os

from moviepy.editor import AudioFileClip
from pytube import YouTube

OUTPUT_DIR = "out"


def process_video(link: str):
    """
    Download the audio from a YouTube video, convert it to mp3, and truncate to 5 minutes
    Return a tuple of the video title, description, and the mp3 file path
    """
    yt = YouTube(link)
    video = yt.streams.filter(only_audio=True).first()
    if video is None:
        raise ValueError("No audio stream found")

    mp4_file = video.download(OUTPUT_DIR)

    # Convert and truncate the file to mp3 using moviepy
    audio_clip = AudioFileClip(mp4_file)
    # Truncate the audio clip to 5 minutes if it's longer than that
    if audio_clip.duration > 300:
        # subclip(start_time, end_time), times in seconds
        audio_clip = audio_clip.subclip(0, 300)
    # [:200] to avoid too long filenames
    mp3_filepath = os.path.join(OUTPUT_DIR, f"{yt.title[:200]}.mp3")
    # codec specification is optional but can be included for clarity
    audio_clip.write_audiofile(mp3_filepath, codec="libmp3lame")
    audio_clip.close()

    # Optionally, delete the original mp4 file after conversion
    os.remove(mp4_file)

    return yt.title, yt.description, mp3_filepath


if __name__ == "__main__":
    link = "https://www.youtube.com/watch?v=zCNrB4wNJUU"
    title, description, mp3_file = process_video(link)
    print(f"Title: {title}")
    print(f"Description: {description}")
    print(f"MP3 file: {mp3_file}")
