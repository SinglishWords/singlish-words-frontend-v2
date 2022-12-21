import { useEffect, useRef, useState } from "react";
import {
  CircularProgress,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import ReCAPTCHA from "react-google-recaptcha";

import { AppButton } from "src/components/AppButton";
import { PopoverButton } from "src/components/PopoverButton";
import { data } from "src/utils/data";
import { Form } from "src/types/state/form.dto";
import { Recaptcha } from "src/types/state/recaptcha.dto";
import {
  startTimer,
  endTimer,
  currentDateTime,
} from "src/utils/logic/timeLogic";
import { useWords } from "src/hooks/useWords";

type QuizPageProps = {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  nextStep: () => void;
};

export const QuizPage = ({ form, setForm, nextStep }: QuizPageProps) => {
  const wordLimit = 20;
  const { words } = useWords(wordLimit);

  const firstResponseRef = useRef<HTMLInputElement | null>(null);
  const secondResponseRef = useRef<HTMLInputElement | null>(null);
  const thirdResponseRef = useRef<HTMLInputElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const [firstResponse, setFirstResponse] = useState<string>("");
  const [secondResponse, setSecondResponse] = useState<string>("");
  const [thirdResponse, setThirdResponse] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(form.data.length);
  const [startTime, setStartTime] = useState<number>(0);
  const [recaptcha, setRecaptcha] = useState<Recaptcha>({
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
    setRecaptcha((recaptcha) => ({
      ...recaptcha,
      showRecaptcha: Math.random() < 0.05,
    }));
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
    if (words) {
      data.push({
        question: {
          id: words[wordIndex]?.id,
          progress: wordIndex + 1,
          word: words[wordIndex]?.word,
        },
        response: [firstResponse, secondResponse, thirdResponse],
        timeOnPage: Math.round((endTimer() - startTime) / 1000),
      });
      setForm({ ...form, endTime: currentDateTime(), data: data });

      /* Move either to the next word or the next page */
      if (wordIndex < words?.length - 1) {
        nextWord();
      } else {
        nextStep();
      }
    }
  };

  const handleRecaptchaChange = () => {
    setRecaptcha({
      ...recaptcha,
      recaptchaAlreadyShown: true,
      isVerified: true,
    });
  };

  return words ? (
    <Stack
      sx={{
        width: { xs: "80%", sm: "60%" },
        margin: "auto",
        pb: { xs: 25, sm: 10 },
      }}
    >
      <Typography variant="h3" sx={{ py: 6 }}>
        {words[wordIndex]?.word}
      </Typography>
      <Stack
        spacing={6}
        sx={{ alignSelf: "center", width: { xs: "100%", sm: "50%" } }}
      >
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
            value={(100 / words?.length) * wordIndex}
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
  ) : (
    <Stack
      sx={{ justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <CircularProgress />
    </Stack>
  );
};
