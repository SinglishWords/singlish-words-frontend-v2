import { useRef } from "react";
import { LinearProgress, Stack, TextField, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { PopoverButton } from "src/components/PopoverButton";
import { data } from "src/utils/data";

type QuizPageProps = {
  nextStep: () => void;
};

export const QuizPage = ({ nextStep }: QuizPageProps) => {
  const firstAssociationRef = useRef<HTMLInputElement | null>(null);
  const secondAssociationRef = useRef<HTMLInputElement | null>(null);
  const thirdAssociationRef = useRef<HTMLInputElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const questions = [
    {
      id: 2976,
      word: "pala otak mak kau",
      enable: 1,
      count: 6,
    },
    {
      id: 2155,
      word: "kuih lompang",
      enable: 1,
      count: 5,
    },
    {
      id: 3896,
      word: "super ring",
      enable: 1,
      count: 6,
    },
    {
      id: 3568,
      word: "senju",
      enable: 1,
      count: 5,
    },
    {
      id: 3480,
      word: "sarong party girl",
      enable: 1,
      count: 5,
    },
    {
      id: 546,
      word: "bodoh macam biskut",
      enable: 1,
      count: 6,
    },
    {
      id: 1244,
      word: "gek sim",
      enable: 1,
      count: 5,
    },
    {
      id: 2067,
      word: "kool",
      enable: 1,
      count: 5,
    },
    {
      id: 1742,
      word: "kaki menyampuk",
      enable: 1,
      count: 5,
    },
    {
      id: 604,
      word: "buay hoo",
      enable: 1,
      count: 6,
    },
    {
      id: 2960,
      word: "pakat",
      enable: 1,
      count: 5,
    },
    {
      id: 3602,
      word: "shiling",
      enable: 1,
      count: 5,
    },
    {
      id: 3762,
      word: "staple your mouth",
      enable: 1,
      count: 5,
    },
    {
      id: 3607,
      word: "shit face",
      enable: 1,
      count: 4,
    },
    {
      id: 1424,
      word: "hati berat",
      enable: 1,
      count: 5,
    },
    {
      id: 2521,
      word: "manja",
      enable: 1,
      count: 4,
    },
    {
      id: 2819,
      word: "not hensem act hensem",
      enable: 1,
      count: 4,
    },
    {
      id: 2161,
      word: "kuih pancong",
      enable: 1,
      count: 6,
    },
    {
      id: 2756,
      word: "nbab",
      enable: 1,
      count: 5,
    },
    {
      id: 3495,
      word: "save yourself",
      enable: 1,
      count: 5,
    },
  ];

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLElement | null>,
    type: string
  ) => {
    if (ref && ref.current && event.key === "Enter") {
      if (type === "text") {
        console.log("text");
        ref.current.focus();
      }
      if (type === "button") {
        console.log("button");
        ref.current.click();
      }
    }
  };

  return (
    <Stack sx={{ alignItems: "center", pb: 10 }}>
      <Typography variant="h3" sx={{ py: 6 }}>
        word
      </Typography>
      <Stack spacing={6} sx={{ width: 500 }}>
        <Stack spacing={6}>
          {/* First Association */}
          <TextField
            label={parse(DOMPurify.sanitize(data.quizPage.instruction))}
            variant="standard"
            inputRef={firstAssociationRef}
            onKeyPress={(event) =>
              handleKeyPress(event, secondAssociationRef, "text")
            }
          />
          {/* Second Association */}
          <TextField
            label={parse(DOMPurify.sanitize(data.quizPage.instruction))}
            variant="standard"
            inputRef={secondAssociationRef}
            onKeyPress={(event) =>
              handleKeyPress(event, thirdAssociationRef, "text")
            }
          />

          {/* Third Association */}
          <TextField
            label={parse(DOMPurify.sanitize(data.quizPage.instruction))}
            variant="standard"
            inputRef={thirdAssociationRef}
            onKeyPress={(event) =>
              handleKeyPress(event, continueButtonRef, "button")
            }
          />
        </Stack>
        <Stack>
          <Typography variant="caption" display="block" gutterBottom>
            {parse(DOMPurify.sanitize(data.quizPage.progress))}
          </Typography>
          <LinearProgress className="progress" variant="determinate" />
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-evenly" }}>
          <PopoverButton
            name={data.quizPage.needHelpButton}
            description={data.quizPage.help}
          />
          <AppButton
            name={data.quizPage.continueButton}
            buttonRef={continueButtonRef}
            onClick={nextStep}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
