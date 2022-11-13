import { useRef } from "react";
import { LinearProgress, Stack, TextField, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { PopoverButton } from "src/components/PopoverButton";
import { data } from "src/utils/data";

type QuizPageProps = {
  nextPage: () => void;
};

export const QuizPage = ({ nextPage }: QuizPageProps) => {
  const firstAssociationRef = useRef<HTMLInputElement | null>(null);
  const secondAssociationRef = useRef<HTMLInputElement | null>(null);
  const thirdAssociationRef = useRef<HTMLInputElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);

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
            onClick={nextPage}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
