"use client";
import { createContext, useContext, useState } from "react";

export interface Transcription {
  text: string;
  link: string;
}

// Type context
interface TranscriptionContextType {
  transcription: Transcription;
  setTranscription: (transcription: Transcription) => void;
}

const TranscriptionContext = createContext<TranscriptionContextType>({
  transcription: {
    text: "",
    link: "",
  },
  setTranscription: () => {},
});

export const useTranscriptionContext = () => useContext(TranscriptionContext);

export const TranscriptionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transcriptionText, setTranscriptionText] = useState<Transcription>({
    text: "",
    link: "",
  });

  return (
    <TranscriptionContext.Provider
      value={{
        transcription: transcriptionText,
        setTranscription: setTranscriptionText,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};
