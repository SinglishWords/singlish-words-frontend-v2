import { Divider, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { data } from "src/utils/data";

type InstructionPageProps = {
  nextStep: () => void;
};

export const InstructionPage = ({ nextStep }: InstructionPageProps) => {
  return (
    <Stack
      spacing={5}
      sx={{
        width: { xs: "80%", sm: "60%" },
        margin: "auto",
        pb: { xs: 25, sm: 10 },
      }}
    >
      {/* good to have - refactor to theme breakpoints https://github.com/mui/material-ui/issues/30484 */}
      <Typography variant="h4" sx={{ py: 4, fontSize: { xs: 30, sm: 35 } }}>
        {parse(DOMPurify.sanitize(data.instructionPage.title))}
      </Typography>
      <Stack
        spacing={3}
        sx={{
          alignSelf: "center",
          "& .MuiTypography-root": { alignSelf: "start" },
        }}
      >
        <Divider sx={{ background: "black" }} />
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
