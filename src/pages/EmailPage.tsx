import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { data } from "src/utils/data";

export const EmailPage = () => {
  const navigate = useNavigate();

  /* Remove saved state from local storage */
  useEffect(() => {
    localStorage.clear();
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

        {/* Paragraph 2 - Get in touch*/}
        <Stack spacing={3}>
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
              DOMPurify.sanitize(data.emailPage.secondParagraph.description2)
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

        {/* Paragraph 3 - Share the study*/}
        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.thirdHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(DOMPurify.sanitize(data.emailPage.thirdParagraph))}
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
          sx={{ alignSelf: "center", fontWeight: "bold" }}
          onClick={() => navigate("/")}
        />
      </Stack>
    </Stack>
  );
};
