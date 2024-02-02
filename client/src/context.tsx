"use client";
import { createContext, useContext, useState } from "react";

export interface Transcription {
  link: string;
}

// Type context
interface TranscriptionContextType {
  transcription: Transcription;
  setTranscription: (transcription: Transcription) => void;
}

const TranscriptionContext = createContext<TranscriptionContextType>({
  transcription: {
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
  const [transcription, setTranscription] = useState<Transcription>({
    link: "",
  });

  return (
    <TranscriptionContext.Provider
      value={{
        transcription: transcription,
        setTranscription: setTranscription,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};
