import { useState } from "react";

import { UserDetailPage } from "src/pages/UserDetailPage";
import { InstructionPage } from "src/pages/InstructionPage";
import { QuizPage } from "src/pages/QuizPage";
import { EmailPage } from "src/pages/EmailPage";
import { Form } from "src/utils/types";

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
    startTime: "",
    endTime: "",
    uuid: "",
    data: [],
  });

  const nextStep = () => {
    setForm({ ...form, step: step + 1 });
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const { step } = form;

  switch (step) {
    default:
      return <h1>Something went wrong!</h1>;
    case 1:
      return (
        <UserDetailPage
          nextStep={nextStep}
          handleChange={handleChange}
          values={form}
        />
      );
    case 2:
      return <InstructionPage nextStep={nextStep} />;
    case 3:
      return <QuizPage nextStep={nextStep} />;
    case 4:
      return <EmailPage />;
  }
};
