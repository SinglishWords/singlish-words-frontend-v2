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

  const nextStep = () => {
    setForm({ ...form, step: step + 1 });
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    {
      /* If user changes to another country of birth, 
        then we should clear the ethnicity field because default country of birth is Singapore*/
    }
    event.target.name === "countryOfBirth"
      ? setForm({
          ...form,
          ethnicity: "",
          [event.target.name]: event.target.value,
        })
      : setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleAddElementToArray = (
    event: React.ChangeEvent<HTMLSelectElement>,
    array: string[]
  ) => {
    {
      /* Duplicate elements not allowed */
    }
    if (!array.includes(event.target.value)) {
      array.push(event.target.value);
    }
    setForm({ ...form, [event.target.name]: array });
  };

  {
    /* Requirement - Button should have an id that corresponds to a field in state 
       in order to clear that state*/
  }
  const handleArrayReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    setForm({ ...form, [event.currentTarget.id]: [] });
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
          handleAddElementToArray={handleAddElementToArray}
          handleArrayReset={handleArrayReset}
          values={form}
        />
      );
    case 2:
      return <InstructionPage nextStep={nextStep} />;
    case 3:
      return <QuizPage nextStep={nextStep} />;
    case 4:
      return <EmailPage values={form} />;
  }
};
