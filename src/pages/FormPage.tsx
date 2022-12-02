import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { UserDetailPage } from "src/pages/UserDetailPage";
import { InstructionPage } from "src/pages/InstructionPage";
import { QuizPage } from "src/pages/QuizPage";
import { EmailPage } from "src/pages/EmailPage";
import { Form } from "src/utils/types";
import { currentDateTime } from "src/utils/logic/timeLogic";

export const FormPage = () => {
  const [form, setForm] = useState<Form>({
    step: 1,
    age: "",
    gender: "",
    education: "",
    countryOfBirth: "Singapore",
    countryOfResidence: "Singapore",
    ethnicity: "",
    isNative: "",
    languagesSpoken: [],
    startTime: currentDateTime(),
    endTime: "",
    uuid: "swow-" + uuidv4(),
    data: [],
  });

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
      return (
        <InstructionPage form={form} setForm={setForm} nextStep={nextStep} />
      );
    case 3:
      return <QuizPage form={form} setForm={setForm} nextStep={nextStep} />;
    case 4:
      return <EmailPage form={form} setForm={setForm} />;
  }
};
