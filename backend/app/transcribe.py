if __name__ == "__main__":
    import whisper
    model = whisper.load_model("base")
    result = model.transcribe("out/short.mp3")
    print(result["text"])
