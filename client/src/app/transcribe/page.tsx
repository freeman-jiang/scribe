"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTranscriptionContext } from "@/context";
import { useEffect, useState } from "react";

interface Annotation {
  reason: string;
  text: string;
}

const parseText = (unformattedText: string) => {
  // Define the regular expression to match the {text}[annotation] pattern
  const regexPattern = /{(.*?)}\[(.*?)\]/g;

  const annotations: Annotation[] = [];
  const highlightedText = unformattedText.replace(
    regexPattern,
    (match, innerPhrase, annotation, offset) => {
      // Store the annotation with its position
      annotations.push({
        reason: annotation,
        text: innerPhrase,
      });

      return `<span class="bg-red-200 selection:text-red-700" data-start="${offset}" data-end="${
        offset + innerPhrase.length
      }">${innerPhrase}</span>`;
    }
  );

  return { highlightedText, annotations };
};

interface AnnotationProps {
  annotation: Annotation;
  expandAll: boolean;
  setAnnotationExpanded: (annotation: Annotation, isExpanded: boolean) => void;
}

const Annotation = ({
  annotation,
  expandAll,
  setAnnotationExpanded,
}: AnnotationProps) => {
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
        setAnnotationExpanded(annotation, isOpen); // Update the state in the parent component
      }}
    >
      <CollapsibleTrigger className="font-semibold">
        {annotation.text}
      </CollapsibleTrigger>
      <CollapsibleContent>{annotation.reason}</CollapsibleContent>
    </Collapsible>
  );
};

const Page = () => {
  const {
    transcription: { text },
  } = useTranscriptionContext();

  const { highlightedText, annotations: parsedAnnotations } = parseText(
    text || example
  );
  const [annotations, setAnnotations] = useState(parsedAnnotations);
  const [expandAll, setExpandAll] = useState(false);

  const setAnnotationExpanded = (
    annotation: Annotation,
    isExpanded: boolean
  ) => {
    setAnnotations(
      annotations.map((a) => {
        if (a === annotation) {
          return { ...a, isExpanded };
        }
        return a;
      })
    );
  };

  return (
    <div className="flex pt-16">
      <div className="max-w-2xl pl-20">
        <div
          contentEditable
          suppressContentEditableWarning={true}
          className="ml-8 text-slate-700 selection:text-black selection:bg-emerald-200 space-pre-wrap outline-none text-lg font-light leading-loose tracking-tight"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>

      <div className="w-full ml-28">
        <Button
          className="mb-4"
          onClick={() => {
            setExpandAll(!expandAll); // Toggle global expand/collapse
            setAnnotations(
              annotations.map((a) => ({ ...a, isExpanded: !expandAll }))
            ); // Apply the change to all annotations
          }}
        >
          {expandAll ? "Collapse" : "Expand"}
        </Button>
        {annotations.map((annotation, index) => (
          <Annotation
            key={index}
            annotation={annotation}
            expandAll={expandAll}
            setAnnotationExpanded={setAnnotationExpanded}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;

const lorem =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. \n\n Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

const example = `It only took open source a year to make a model that reaches the level of {QPT3.5}[incorrect proper noun, should be GPT-3.5], while some may say {opening up has no modes}[grammatically incorrect and contextually nonsensical phrase, potentially meant to say "open source has its limits" or "open source has no downsides"] because of this, but a year in AI time is really on a different scale than in real life. Anyways, this {mode discussion}[unclear phrase, possibly meant to say "model discussion" or "method discussion"] all came back into the picture thanks to {Mistro publishing, Mixro AX7B}[incorrect proper nouns, should be "Mistral publishing, Mixtral-8x7B"], and right off the bat you will notice that it has a really unique naming scheme. Instead of a whole number that will represent a model's parameter count, which is what people usually do, they are doing maths on its name, and it's because they are referring to a new architecture paradigm which they introduce for this model, called {mixture of experts}[correct term but should be capitalized as it's a specific technique: Mixture of Experts], which is completely different from how most LLMs operate. While the main idea of {mixture of experts}[correct term but should be capitalized: Mixture of Experts] is nothing new, it has not been a prominent method for LLMs especially at scale. The people at {Mistro}[incorrect proper noun, should be "Mistral"] were able to make this method work and perform better than {Gemini Pro, Claude 2.1, and QPT3.5}[incorrect proper nouns and likely inaccurate names, potentially should be "competitors like Google AI, Cloud AI, and GPT-3.5"]. So what exactly is this {mixture of experts}[correct term but should be capitalized: Mixture of Experts] approach? Well, rather than using a {neuronet}[incorrect term, should be "neural network"] that is for example 512 wide, why not {swing into}[awkward phrasing, possibly should be "split into"] 8 {neuronetworks}[incorrect term, should be "neural networks"] of 64? If something like a router can pick the correct network for each inference, then we technically only have to run one eighth of the neurons on every forward pass. While the core idea is that there's eight expert models that specialize in different topics, and instead of combining results from all the models, a router decides which two expert models to trust to when given a question or a prompt. And by only using two models, it reduces the computational costs and increases the speed of generation. This then combines the strength of multiple smaller expert models to solve the problem when the user throws at it. But how can it be so good? Well, a reason might be a lot of research has already proven that smaller models focused on a specific topic, outperforms a larger model that is more generalized, so you can kind of interpret {a mixture of 8x7b}[incorrect term, should be "Mixtral-8x7B"] in two ways. It is a 47b model, but with 13b model speed, or a 13b model that has performance of a 47b model, which makes the router extremely important here because it has to choose the right model that would generate the best results. How does this router know which expert to choose then? Well, it learned to choose the best experts during training. This is achieved by having a router trained together with all the experts, {than using}[grammatically incorrect, should be "then using"] a softmax gating function to model a probability distribution and choose who gets what. But how does that work? And if we just train it randomly, it will most likely be one strong in 7 week models, because the one that initialized first will always be the best, which will lose the reasons for using {MOE}[acronym not previously defined, should be defined as "Mixture of Experts (MoE)"]. So we need to make sure of them are equally good. To overcome these obstacles, they add a noise to the router and penalize the router if it did not equally distribute its choices across all experts, which incentivizes the router to develop an {MOE}[acronym not previously defined, should be "Mixture of Experts (MoE)"] where all the experts are used equally during training. So overall, the researchers do not get to decide which expert specialize in what the process of gradient descent does, which still makes it kind of like a black box. But as long as it's better, it's free real estate. They said that surprisingly, we do not observe obvious patterns in the assignment of experts based on the topic. And also, this suggests that the router does exhibit some structured synthetic behavior. So the experts appear to be more aligned with the syntax and semantics rather than the knowledge domain we would have otherwise assumed. But it kind of makes sense given how the model is trained to hop from experts to experts between each token. In this example, they gave each color represents an expert model that router assigns the token to. For the Python codes, you can see more clearly about the patterns of the assignments. While {self and death}[incorrect terms, should be "self and def" referring to Python keywords] are assigned to another expert model. So by not {opening the same color}[unclear phrase, possibly meant to say "opting for the same color"] when all the tokens are about coding and instead have different colors across the board, it shows that the router assigns the expert models based on the syntax or semantics and not a subject domain. Some people even made a {5-2 MOE}[incorrect term, unclear meaning, possibly a typographical error or misheard phrase] and oh wow, these {opens where people do work}[grammatically incorrect and nonsensical phrase, possibly meant to say "open source community works"] really fast. And if you do want to run {mixed row}[incorrect proper noun, should be "Mixtral"], I have some bad news for you, while it is claimed to only use 13 billion parameters when running, 86GB of VRAM is still the recommended VRAM size to run it without quantizing it. So good luck collecting those VRAMs in the wild. But there is a tensor RTLM version of {mixed row}[incorrect proper noun, should be "Mixtral"]. So use this information on your own description. And before we end this video, here's an early heads up for NVIDIA's GTC 24. Because if you attend a digital session any time between March 18 and 21, you may have a chance to win an RTX 4080 Super from me. So if you are interested in NVIDIA's upcoming AI breakthroughs and announcements or just want to win a brand new GPU, use the link down in description to sign up right now so you don't forget. The GTC 24 AI conference this year has three different registrations ranging from in-person, virtual and workshop. The GTC in-person conference pass has early bird pricing right now and you can connect with some cool industrial people face to face during the GTC event. The virtual session is completely free to sign up but it has limited spaces but it lets you attend some key GTC events across the web. And then there's the four day workshop where you can attend both in-person or virtually and earn certificates of competence. This year's GTC conference has topics such as generative AI, computer vision and innovative workflows. So don't miss out this chance to learn from the global experts. I am still planning how to make the giveaways but it will probably be along the lines of taking a photo of yourself watching the GTC virtually. So sign up now and you won't forget. Thank you so much for watching a big shout out to Andrew {Lascheles}[incorrect proper noun, should be "Lescelius"], Chris {Ladoux}[incorrect proper noun, should be "LeDoux"], Alex J, Alex {Maries}[incorrect proper noun, should be "Maurice"], {Big Willem}[incorrect proper noun, should be "Daddy Wen"], Deegan, {Fethel}[incorrect proper noun, should be "FiFaŁ"] and many others that support me through Patreon or YouTube. Follow my twitter if you haven't and I'll see you in the next one.`;
