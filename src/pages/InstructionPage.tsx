import { Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { data } from "src/utils/data";
import { Form } from "src/utils/types";

type InstructionPageProps = {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  nextStep: () => void;
};

export const InstructionPage = ({
  form,
  setForm,
  nextStep,
}: InstructionPageProps) => {
  return (
    <Stack spacing={5} sx={{ alignItems: "center", pb: 10 }}>
      <Typography variant="h4" sx={{ py: 4 }}>
        {parse(DOMPurify.sanitize(data.instructionPage.title))}
      </Typography>
      <Stack
        spacing={3}
        sx={{
          width: 750,
          "& .MuiTypography-root": { alignSelf: "start" },
        }}
      >
        <Typography variant="h5">
          {parse(DOMPurify.sanitize(data.instructionPage.firstHeader))}
        </Typography>
        <Typography variant="body1">
          {parse(DOMPurify.sanitize(data.instructionPage.firstParagraph))}
        </Typography>
        <Typography variant="h5">
          {parse(DOMPurify.sanitize(data.instructionPage.secondHeader))}
        </Typography>
        <Typography variant="body1">
          {parse(DOMPurify.sanitize(data.instructionPage.secondParagraph))}
        </Typography>
      </Stack>

      <Stack direction="row" sx={{ justifyContent: "center" }}>
        <AppButton
          name={data.instructionPage.continueButton}
          onClick={nextStep}
        />
      </Stack>
    </Stack>
  );
};
