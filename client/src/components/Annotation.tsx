import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";

export interface AnnotationType {
  reason: string;
  text: string;
}

interface Props {
  annotation: AnnotationType;
  expandAll: boolean;
}

export const Annotation = ({ annotation, expandAll }: Props) => {
  // Individual state for each annotation, but initially set by the global expandAll state
  const [isExpanded, setIsExpanded] = useState(expandAll);

  // Effect to synchronize individual state with global state
  useEffect(() => {
    setIsExpanded(expandAll);
  }, [expandAll]);

  return (
    <Collapsible
      className="mb-2 p-2 border-l-4 border-red-300 bg-red-100 max-w-xl"
      open={isExpanded}
      onOpenChange={(isOpen) => {
        setIsExpanded(isOpen); // Update individual state
      }}
    >
      <CollapsibleTrigger className="font-semibold">
        {annotation.text}
      </CollapsibleTrigger>
      <CollapsibleContent>{annotation.reason}</CollapsibleContent>
    </Collapsible>
  );
};
