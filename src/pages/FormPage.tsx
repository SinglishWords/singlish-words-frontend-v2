import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { UserDetailPage } from "src/pages/UserDetailPage";
import { InstructionPage } from "src/pages/InstructionPage";
import { QuizPage } from "src/pages/QuizPage";
import { EmailPage } from "src/pages/EmailPage";
import { Form } from "src/types/state/form.dto";
import { setFivePercentProbability } from "src/utils/logic/probabilityLogic";
import { currentDateTime } from "src/utils/logic/timeLogic";
import { Validator } from "src/types/state/validator.dto";

export const FormPage = () => {
  const checkForFormInStorage = () => {
    const storage = localStorage.getItem("formState");
    return storage !== null
      ? JSON.parse(storage)
      : {
          step: 1,
          age: "",
          gender: "",
          education: "",
          countryOfBirth: "Singapore",
          countryOfResidence: "Singapore",
          durationOfSgpResidence: "",
          ethnicity: "",
          isNative: "",
          languagesSpoken: [],
          startTime: currentDateTime(),
          endTime: "",
          uuid: "swow-" + uuidv4(),
          data: [],
        };
  };

  const checkForRecaptchaInStorage = () => {
    const storage = localStorage.getItem("recaptchaState");
    return storage !== null
      ? JSON.parse(storage)
      : {
          isVerified: false,
          /* 5% chance of recaptcha rendering to catch bots */
          showValidator: setFivePercentProbability(),
        };
  };
  const [form, setForm] = useState<Form>(checkForFormInStorage());
  const [recaptcha, setRecaptcha] = useState<Validator>(
    checkForRecaptchaInStorage()
  );

  /* Save state in localStorage when there is an update in the recaptcha state */
  useEffect(() => {
    localStorage.setItem("recaptchaState", JSON.stringify(recaptcha));
  }, [recaptcha]);

  /* Save state in localStorage when there is an update in the form state */
  useEffect(() => {
    localStorage.setItem("formState", JSON.stringify(form));
  }, [form]);

  const { step } = form;

  const nextStep = () => {
    setForm({ ...form, step: step + 1 });
  };

  switch (step) {
    default:
      return <h1>Something went wrong!</h1>;
    case 1:
      return (
        <UserDetailPage form={form} setForm={setForm} nextStep={nextStep} />
      );
    case 2:
      return <InstructionPage nextStep={nextStep} />;
    case 3:
      return (
        <QuizPage
          form={form}
          setForm={setForm}
          nextStep={nextStep}
          recaptcha={recaptcha}
          setRecaptcha={setRecaptcha}
        />
      );
    case 4:
      return (
        <EmailPage form={form} setForm={setForm} setRecaptcha={setRecaptcha} />
      );
  }
};
