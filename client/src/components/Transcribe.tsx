import { useTranscriptionContext } from "@/context";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const LINKS = [
  {
    link: "https://www.youtube.com/watch?v=MzpCI4wW7mY",
    title: "3 Minute Camille Guide - A Guide for League of Legends",
  },
  {
    title: "Why Rich People (sorta) Don't Wear Luxury",
    link: "https://www.youtube.com/watch?v=g0UQgrFNExc",
  },
  {
    title: "January Web Dev News",
    link: "https://www.youtube.com/watch?v=tQKPSnkmGxE",
  },
];

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

    setTranscription({ link: youtubeUrl });
    router.push(`/transcribe`);
  };

  const handleClick = (link: string) => {
    setTranscription({ link });
    router.push(`/transcribe`);
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
      <div className="mt-2 rounded-lg shadow-lg bg-white w-96 p-4">
        Or try some of the following videos:
        <ul className="list-disc pl-6">
          {LINKS.map((link) => (
            <li key={link.link} className="mt-2">
              <p
                className="underline text-slate-600 cursor-pointer"
                onClick={() => handleClick(link.link)}
              >
                {link.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { Transcribe };
