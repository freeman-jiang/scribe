"use client";

import { Button } from "@/components/ui/button";
import { useTranscriptionContext } from "@/context";

const Page = () => {
  const {
    transcription: { link, text },
  } = useTranscriptionContext();

  return (
    <div className="px-20 pl-36">
      <div className="w-full">
        <div
          contentEditable
          className="text-slate-700 selection:text-black selection:bg-emerald-300 tespace-pre-wrap outline-none mt-20 max-w-xl text-[1.2vw] font-light leading-loose tracking-tight"
        >
          {text || lorem}
        </div>
        <Button className="mt-4">Load more...</Button>
      </div>
    </div>
  );
};
export default Page;

const lorem =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. \n\n Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
