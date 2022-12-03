import { useEffect, useRef, useState } from "react";
import { LinearProgress, Stack, TextField, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import ReCAPTCHA from "react-google-recaptcha";

import { AppButton } from "src/components/AppButton";
import { PopoverButton } from "src/components/PopoverButton";
import { data } from "src/utils/data";
import { FormType, RecaptchaType } from "src/utils/types";
import {
  startTimer,
  endTimer,
  currentDateTime,
} from "src/utils/logic/timeLogic";

type QuizPageProps = {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  nextStep: () => void;
};

const words = [
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

export const QuizPage = ({ form, setForm, nextStep }: QuizPageProps) => {
  const firstResponseRef = useRef<HTMLInputElement | null>(null);
  const secondResponseRef = useRef<HTMLInputElement | null>(null);
  const thirdResponseRef = useRef<HTMLInputElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const [firstResponse, setFirstResponse] = useState<string>("");
  const [secondResponse, setSecondResponse] = useState<string>("");
  const [thirdResponse, setThirdResponse] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(form.data.length);
  const [startTime, setStartTime] = useState<number>(0);
  const numberOfWords = words?.length;
  const wordId = words[wordIndex]?.id;
  const currentWord = words[wordIndex]?.word;
  const [recaptcha, setRecaptcha] = useState<RecaptchaType>({
    isVerified: false,
    /* 5% chance of recaptcha rendering to catch bots */
    showRecaptcha: Math.random() < 0.05,
    /* Render recaptcha once on Quiz page, at random depending on showRecaptcha boolean */
    recaptchaAlreadyShown: false,
  });

  /* Once user clicks the "Continue" button, reset all test fields and reset
    cursor back to the first association textfield */
  useEffect(() => {
    setStartTime(startTimer());
    setRecaptcha({ ...recaptcha, showRecaptcha: Math.random() < 0.05 });
    setFirstResponse("");
    setSecondResponse("");
    setThirdResponse("");
    if (firstResponseRef.current) {
      firstResponseRef.current.value = "";
      firstResponseRef.current.focus();
    }
    if (secondResponseRef.current) secondResponseRef.current.value = "";
    if (thirdResponseRef.current) thirdResponseRef.current.value = "";
  }, [wordIndex]);

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLElement | null>,
    type: string
  ) => {
    if (ref && ref.current && event.key === "Enter") {
      if (type === "text") {
        ref.current.focus();
      }
      if (type === "button") {
        ref.current.click();
      }
    }
  };

  const nextWord = () => setWordIndex(wordIndex + 1);

  const handleClick = () => {
    /* Update form state */
    const data = form.data;
    data.push({
      question: {
        id: wordId,
        progress: wordIndex + 1,
        word: currentWord,
      },
      response: [firstResponse, secondResponse, thirdResponse],
      timeOnPage: Math.round((endTimer() - startTime) / 1000),
    });
    setForm({ ...form, endTime: currentDateTime(), data: data });

    /* Move either to the next word or the next page */
    if (wordIndex < numberOfWords - 1) {
      nextWord();
    } else {
      nextStep();
    }
  };

  const handleRecaptchaChange = () => {
    setRecaptcha({
      ...recaptcha,
      recaptchaAlreadyShown: true,
      isVerified: true,
    });
  };

  return (
    <Stack sx={{ alignItems: "center", pb: 10 }}>
      <Typography variant="h3" sx={{ py: 6 }}>
        {currentWord}
      </Typography>
      <Stack spacing={6} sx={{ width: 500 }}>
        <Stack spacing={6}>
          {/* First Association */}
          <TextField
            label={parse(DOMPurify.sanitize(data.quizPage.instruction))}
            variant="standard"
            inputRef={firstResponseRef}
            onKeyPress={(event) =>
              handleKeyPress(event, secondResponseRef, "text")
            }
            onChange={(event) => setFirstResponse(event.target.value)}
          />
          {/* Second Association */}
          <TextField
            label={parse(DOMPurify.sanitize(data.quizPage.instruction))}
            variant="standard"
            inputRef={secondResponseRef}
            onKeyPress={(event) =>
              handleKeyPress(event, thirdResponseRef, "text")
            }
            onChange={(event) => setSecondResponse(event.target.value)}
          />
          {/* Third Association */}
          <TextField
            label={parse(DOMPurify.sanitize(data.quizPage.instruction))}
            variant="standard"
            inputRef={thirdResponseRef}
            onKeyPress={(event) =>
              handleKeyPress(event, continueButtonRef, "button")
            }
            onChange={(event) => setThirdResponse(event.target.value)}
          />
        </Stack>
        <Stack>
          <Typography variant="caption" display="block" gutterBottom>
            {parse(DOMPurify.sanitize(data.quizPage.progress))}
          </Typography>
          <LinearProgress
            className="progress"
            variant="determinate"
            value={(100 / numberOfWords) * wordIndex}
          />
        </Stack>
        {/* Recaptcha that randomly appears one time in quiz page .
          Show Recaptcha once at random if it has not been shown. */}
        {recaptcha.showRecaptcha && !recaptcha.recaptchaAlreadyShown ? (
          <Stack sx={{ alignItems: "center" }}>
            <ReCAPTCHA
              /* To change site key once actual site is up.
                Use smallworldofsinglishwords@gmail.com */
              sitekey="6Ldy0tQbAAAAANL-FvKgyzKBeWcGSaER4cd9jta0"
              onChange={handleRecaptchaChange}
            />
          </Stack>
        ) : null}
        <Stack direction="row" sx={{ justifyContent: "space-evenly" }}>
          <PopoverButton
            name={data.quizPage.needHelpButton}
            description={data.quizPage.help}
          />
          <AppButton
            name={data.quizPage.continueButton}
            buttonRef={continueButtonRef}
            onClick={handleClick}
            disabled={
              recaptcha.showRecaptcha && !recaptcha.recaptchaAlreadyShown
                ? !recaptcha.isVerified
                : false
            }
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
