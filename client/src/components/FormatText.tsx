import { cn } from "@/lib/utils";
import { FormEvent, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Props {
  unformattedText: string;
}

interface Regular {
  type: "regular";
  value: string;
}

interface Problem {
  type: "problem";
  value: string;
  reason: string;
}

const parse = (unformattedText: string) => {
  const regexPattern = /{(.*?)}\[(.*?)\]/g;
  const parsedText: (Regular | Problem)[] = [];

  let lastIndex = 0;

  unformattedText.replace(regexPattern, (match, phrase, reason, index) => {
    // Add the text before the match
    if (index > lastIndex) {
      parsedText.push({
        type: "regular",
        value: unformattedText.slice(lastIndex, index),
      });
    }

    // Add the problem
    parsedText.push({ type: "problem", value: phrase, reason: reason });

    // Update lastIndex to the end of the current match
    lastIndex = index + match.length;

    // Return value is not used in replace, but function must return something
    return match;
  });

  // Add any remaining text after the last match
  if (lastIndex < unformattedText.length) {
    parsedText.push({
      type: "regular",
      value: unformattedText.slice(lastIndex),
    });
  }

  return parsedText;
};

export const FormatText = ({ unformattedText }: Props) => {
  const [editedText, setEditedText] = useState<string>("");
  const [parsedText, setParsedText] = useState<(Regular | Problem)[]>(
    parse(unformattedText)
  );

  const removeProblem = (problemValue: string) => {
    setParsedText((currentParsedText) => {
      // Filter out the old item
      let filtered = currentParsedText.filter(
        (item) => item.value !== problemValue
      );

      // Combine consecutive regular elements
      let combined = filtered.reduce(
        (acc: (Regular | Problem)[], item, index, array) => {
          if (
            index > 0 &&
            item.type === "regular" &&
            array[index - 1].type === "regular"
          ) {
            acc[acc.length - 1].value += item.value;
          } else {
            acc.push(item);
          }
          return acc;
        },
        []
      );

      return combined;
    });
  };

  const ProblemSection = ({
    value,
    reason,
    removeProblem,
  }: Problem & { removeProblem: (problemValue: string) => void }) => {
    const originalText = value;
    const [isDifferent, setIsDifferent] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    // if (isEmpty) {
    //   setParsedText(parsedText.filter((item) => item.value !== value));
    //   return null;
    // }

    const handleInput = (e: FormEvent<HTMLButtonElement>) => {
      const currentText = e.currentTarget.textContent;
      if (!currentText) {
        removeProblem(value);
      } else if (currentText !== value) {
        setIsDifferent(true);
      } else {
        setIsDifferent(false);
      }
    };

    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger
            className={cn(
              {
                "bg-red-200 selection:bg-red-400": !isDifferent,
              },
              { "bg-blue-100 selection:text-black": isDifferent },
              "cursor-text outline-none"
            )}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
          >
            {isEmpty ? " " : originalText}
          </TooltipTrigger>

          <TooltipContent className="font-normal text-base max-w-lg">
            {reason}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Render the formatted text
  return (
    <div>
      {parsedText.map((part, index) => {
        if (part.type === "regular") {
          return (
            <span
              key={index}
              contentEditable="true"
              suppressContentEditableWarning
              className="outline-none"
            >
              {part.value}
            </span>
          );
        } else if (part.type === "problem") {
          return (
            <ProblemSection
              {...part}
              removeProblem={removeProblem}
              key={index}
            />
          );
        }
      })}
    </div>
  );
};
