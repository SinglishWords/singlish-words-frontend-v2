import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { data } from "src/utils/data";
import { Form } from "src/types/state/form.dto";

type EmailPageProps = {
  form: Form;
};

export const EmailPage = ({ form }: EmailPageProps) => {
  const [copied, setCopied] = useState<boolean>(false);
  const navigate = useNavigate();

  /* Remove saved state from local storage */
  useEffect(() => {
    localStorage.removeItem("formState");
  }, []);

  return (
    <Stack
      spacing={5}
      sx={{
        width: { xs: "80%", sm: "60%" },
        margin: "auto",
        pb: { xs: 25, sm: 10 },
      }}
    >
      <Typography variant="h3" sx={{ py: 4 }}>
        {parse(DOMPurify.sanitize(data.emailPage.title))}
      </Typography>
      <Stack
        spacing={6}
        sx={{
          flex: 1,
          alignSelf: "center",
          "& .MuiTypography-root": { alignSelf: "start" },
        }}
      >
        {/* Paragraph 1 - What we are trying to do */}
        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.firstHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(DOMPurify.sanitize(data.emailPage.firstParagraph))}
          </Typography>
        </Stack>

        {/* Paragraph 2 - If you would like to take part in the lucky draw or receive updates about this research */}
        {/* <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.secondHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.secondParagraph.description1)
            )}
            <Link
              sx={{
                cursor: "pointer",
                "&:hover": { color: "secondary.main" },
              }}
              onClick={() =>
                window.open(data.email.link.singlishwords, "_blank")
              }
            >
              {parse(DOMPurify.sanitize(data.email.html.singlishwords))}
            </Link>
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.secondParagraph.enterCode)
            )}
          </Typography>
          <Stack
            spacing={{ xs: 2, sm: 7 }}
            direction="row"
            sx={{
              border: "2px solid",
              p: { xs: 1, sm: 4 },
              justifyContent: "center",
            }}
          > */}
        {/* good to have - refactor to theme breakpoints https://github.com/mui/material-ui/issues/30484 */}
        {/* <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: 15, sm: 30 },
              }}
            >
              {form.uuid}
            </Typography>
            <AppButton
              name={copied ? "COPIED!" : "COPY"}
              onClick={() => {
                setCopied(true);
                navigator.clipboard.writeText(form.uuid);
              }}
            />
          </Stack>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.secondParagraph.description2)
            )}
          </Typography>
        </Stack> */}

        {/* Paragraph 3 - Lucky Draw T&C*/}
        {/* <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.thirdHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(DOMPurify.sanitize(data.emailPage.thirdParagraph))}
          </Typography>
        </Stack> */}

        {/* Paragraph 4 - Get in touch*/}
        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.fourthHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.fourthParagraph.description1)
            )}
            <Link
              sx={{
                cursor: "pointer",
                "&:hover": { color: "secondary.main" },
              }}
              onClick={() =>
                window.open(data.email.link.singlishwords, "_blank")
              }
            >
              {parse(DOMPurify.sanitize(data.email.html.singlishwords))}
            </Link>
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.fourthParagraph.description2)
            )}
            <Link
              sx={{
                cursor: "pointer",
                "&:hover": { color: "secondary.main" },
              }}
              onClick={() => window.open(data.email.link.professor, "_blank")}
            >
              {parse(DOMPurify.sanitize(data.email.html.professor))}
            </Link>
          </Typography>
        </Stack>

        {/* Paragraph 5 - Share the study*/}
        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.fifthHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(DOMPurify.sanitize(data.emailPage.fifthParagraph))}
            <Link
              sx={{
                cursor: "pointer",
                "&:hover": { color: "secondary.main" },
              }}
              onClick={() => window.open(data.url.link.singlishwords, "_blank")}
            >
              {parse(DOMPurify.sanitize(data.url.html.singlishwords))}
            </Link>
          </Typography>
        </Stack>
        <AppButton
          name={"RETURN TO HOME PAGE"}
          sx={{ alignSelf: "end", fontWeight: "bold" }}
          onClick={() => navigate("/")}
        />
      </Stack>
    </Stack>
  );
};
