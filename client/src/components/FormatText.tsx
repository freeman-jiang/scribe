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

export const FormatText = ({ unformattedText }: Props) => {
  const regexPattern = /{(.*?)}\[(.*?)\]/g;
  const parsedText: (Regular | Problem)[] = [];

  let lastIndex = 0;

  console.log(unformattedText);

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

  // Render the formatted text
  return parsedText.map((part, index) => {
    if (part.type === "regular") {
      return <span key={index}>{part.value}</span>;
    } else if (part.type === "problem") {
      return (
        <TooltipProvider key={index}>
          <Tooltip delayDuration={100}>
            <TooltipTrigger className="bg-red-200 selection:text-red-600">
              {part.value}
            </TooltipTrigger>
            <TooltipContent className="font-normal text-base max-w-lg">
              {part.reason}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  });
};
