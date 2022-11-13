import { useState } from "react";
import { Link, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { Footer } from "src/components/Footer";
import { data } from "src/utils/data";
import { Form } from "src/utils/types";

type EmailPageProps = {
  values: Form;
};

export const EmailPage = ({ values }: EmailPageProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <Stack spacing={5} sx={{ minHeight: "100vh" }}>
      <Typography variant="h3" sx={{ py: 4 }}>
        {parse(DOMPurify.sanitize(data.emailPage.title))}
      </Typography>
      <Stack
        spacing={6}
        sx={{
          flex: 1,
          width: 750,
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
        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.secondHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.secondParagraph.description1)
            )}
            <Link
              sx={{ cursor: "pointer", "&:hover": { color: "secondary.main" } }}
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
          <Stack spacing={7} direction="row" sx={{ border: "2px solid", p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {values.uuid}
            </Typography>
            <AppButton
              name={copied ? "COPIED!" : "COPY"}
              onClick={() => {
                setCopied(true);
                navigator.clipboard.writeText(values.uuid);
              }}
            />
          </Stack>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.secondParagraph.description2)
            )}
          </Typography>
        </Stack>

        {/* Paragraph 3 - Lucky Draw T&C*/}
        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.thirdHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(DOMPurify.sanitize(data.emailPage.thirdParagraph))}
          </Typography>
        </Stack>

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
              sx={{ cursor: "pointer", "&:hover": { color: "secondary.main" } }}
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
              sx={{ cursor: "pointer", "&:hover": { color: "secondary.main" } }}
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
              sx={{ cursor: "pointer", "&:hover": { color: "secondary.main" } }}
              onClick={() => window.open(data.url.link.singlishwords, "_blank")}
            >
              {parse(DOMPurify.sanitize(data.url.html.singlishwords))}
            </Link>
          </Typography>
        </Stack>
      </Stack>

      {/* Footer */}
      <Footer />
    </Stack>
  );
};
