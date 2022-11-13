import { Link, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { Footer } from "src/components/Footer";
import { data } from "src/utils/data";

export const EmailPage = () => {
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
                window.open(data.emailPage.secondParagraph.emailLink, "_blank")
              }
            >
              {parse(
                DOMPurify.sanitize(data.emailPage.secondParagraph.emailHtml)
              )}
            </Link>
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.secondParagraph.enterCode)
            )}
          </Typography>
          <Stack spacing={7} direction="row" sx={{ border: "2px solid", p: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              swow-23b46130-1c0c-438d-8bbf-d89575e9b311
            </Typography>
            <AppButton name={"COPY"} />
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
                window.open(data.emailPage.fourthParagraph.emailLink, "_blank")
              }
            >
              {parse(
                DOMPurify.sanitize(data.emailPage.fourthParagraph.emailHtml)
              )}
            </Link>
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.fourthParagraph.description2)
            )}
            <Link
              sx={{ cursor: "pointer", "&:hover": { color: "secondary.main" } }}
              onClick={() =>
                window.open(data.emailPage.fourthParagraph.emailLink2, "_blank")
              }
            >
              {parse(
                DOMPurify.sanitize(data.emailPage.fourthParagraph.emailHtml2)
              )}
            </Link>
          </Typography>
        </Stack>

        {/* Paragraph 5 - Share the study*/}
        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.fifthHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.fifthParagraph.description1)
            )}
            <Link
              sx={{ cursor: "pointer", "&:hover": { color: "secondary.main" } }}
              onClick={() =>
                window.open(data.emailPage.fifthParagraph.emailLink, "_blank")
              }
            >
              {parse(
                DOMPurify.sanitize(data.emailPage.fifthParagraph.emailHtml)
              )}
            </Link>
          </Typography>
        </Stack>
      </Stack>

      {/* Footer */}
      <Footer />
    </Stack>
  );
};
