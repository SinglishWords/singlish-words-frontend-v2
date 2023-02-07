import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Checkbox,
  CircularProgress,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
// import ReCAPTCHA from "react-google-recaptcha";

import { AppButton } from "src/components/AppButton";
import { PopoverButton } from "src/components/PopoverButton";
import { data } from "src/utils/data";
import { Form } from "src/types/state/form.dto";
import { Validator } from "src/types/state/validator.dto";
import { setFivePercentProbability } from "src/utils/logic/probabilityLogic";
import {
  startTimer,
  endTimer,
  currentDateTime,
} from "src/utils/logic/timeLogic";
import { useWords } from "src/hooks/useWords";
import { useSubmitForm } from "src/hooks/useForm";

type QuizPageProps = {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  recaptcha: Validator;
  setRecaptcha: React.Dispatch<React.SetStateAction<Validator>>;
  nextStep: () => void;
};

export const QuizPage = ({
  form,
  setForm,
  recaptcha,
  setRecaptcha,
  nextStep,
}: QuizPageProps) => {
  const wordLimit = 20;
  const navigate = useNavigate();
  const { submitForm } = useSubmitForm();
  const { words, refetchWords } = useWords(wordLimit);

  const firstResponseRef = useRef<HTMLInputElement | null>(null);
  const secondResponseRef = useRef<HTMLInputElement | null>(null);
  const thirdResponseRef = useRef<HTMLInputElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const [firstResponse, setFirstResponse] = useState<string>("");
  const [secondResponse, setSecondResponse] = useState<string>("");
  const [thirdResponse, setThirdResponse] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(form.data.length);
  const [startTime, setStartTime] = useState<number>(0);

  /* Pull the data once when the user renders page*/
  useEffect(() => {
    refetchWords();
  }, [refetchWords]);

  /* Once user clicks the "Continue" button, reset all test fields and reset
    cursor back to the first association textfield */
  useEffect(() => {
    setStartTime(startTimer());
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

      /* Set recaptcha */
      setRecaptcha((recaptcha) => ({
        ...recaptcha,
        showValidator: setFivePercentProbability(),
      }));

      /* Move either to the next word or the next page */
      if (wordIndex < words?.length - 1) {
        nextWord();
      } else {
        submitForm(form);
        nextStep();
      }
    }
  };

  const handleRecaptchaChange = () => {
    setRecaptcha({
      ...recaptcha,
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
        {/* Validator that randomly appears one time in quiz page .
          Show Validator once at random if it has not been shown. */}
        {recaptcha.showValidator && !recaptcha.isVerified ? (
          <Stack sx={{ alignItems: "center" }}>
            {/* Render issue with reCaptcha observed - https://stackoverflow.com/questions/31776929/google-recaptcha-sometimes-doesnt-get-displayed-rendered*/}
            <Typography variant="body2" sx={{ fontSize: 10, mb: 1 }}>
              {/* Please refresh the page if you see this message but do not see
              reCaptcha! */}
              Please tick the box below to continue.
            </Typography>
            <Stack>
              <Checkbox
                checked={recaptcha.isVerified}
                onClick={handleRecaptchaChange}
              />
              {/* <ReCAPTCHA
                // Use smallworldofsinglishwords@gmail.com
                sitekey="6Ldy0tQbAAAAANL-FvKgyzKBeWcGSaER4cd9jta0"
                onChange={handleRecaptchaChange}
              /> */}
            </Stack>
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
            disabled={recaptcha.showValidator ? !recaptcha.isVerified : false}
          />
        </Stack>
      </Stack>
    </Stack>
  ) : (
    <Stack
      spacing={10}
      sx={{ justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <CircularProgress />
      <AppButton
        name={"RETURN TO HOME PAGE"}
        sx={{ alignSelf: "center", fontWeight: "bold" }}
        onClick={() => navigate("/")}
      />
    </Stack>
  );
};
