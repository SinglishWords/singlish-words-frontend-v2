import { useState } from "react";

import { UserDetailPage } from "src/pages/UserDetailPage";
import { InstructionPage } from "src/pages/InstructionPage";
import { QuizPage } from "src/pages/QuizPage";
import { EmailPage } from "src/pages/EmailPage";

export const FormPage = () => {
  const [page, setPage] = useState<number>(1);

  const nextPage = () => setPage(page + 1);

  switch (page) {
    default:
      return <h1>Something went wrong!</h1>;
    case 1:
      return <UserDetailPage nextPage={nextPage} />;
    case 2:
      return <InstructionPage nextPage={nextPage} />;
    case 3:
      return <QuizPage nextPage={nextPage} />;
    case 4:
      return <EmailPage />;
  }
};
