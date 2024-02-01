import { customAxios } from "@/config";
import { useTranscriptionContext } from "@/context";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Transcribe = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const { setTranscription } = useTranscriptionContext();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!youtubeUrl) {
      alert("Please enter a YouTube URL!");
      return;
    }

    try {
      const response = await customAxios.get<string>(
        `/transcribe?youtube_url=${youtubeUrl}`
      );
      setTranscription({ link: youtubeUrl, text: response.data });
      router.push(`/transcribe`);

      // Do something with the audio file path, e.g., display it or provide a download link
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="w-full"
            />
          </div>
          <div>
            <Button type="submit" color="primary" className="w-full">
              Transcribe
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Transcribe };
