import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import NUS_Logo from "src/assets/images/NUS_Logo.png";
import { AppButton } from "src/components/AppButton";
import { Footer } from "src/components/Footer";
import { data } from "src/utils/data";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={5} sx={{ minHeight: "100vh" }}>
      <Stack
        spacing={{ xs: 3, sm: 0 }}
        sx={{ width: { xs: "80%", sm: "60%" }, alignSelf: "center", flex: 1 }}
      >
        {/* Title */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "center" }}
        >
          <Box
            component="img"
            src={NUS_Logo}
            sx={{
              width: { sm: "30%" },
              height: { sm: "50%" },
            }}
          />
          <Stack
            spacing={1}
            sx={{
              "& .MuiTypography-root": {
                color: "primary.main",
                fontWeight: 600,
              },
              justifyContent: "center",
            }}
          >
            {/* good to have - refactor to theme breakpoints https://github.com/mui/material-ui/issues/30484 */}
            <Typography variant="h2" sx={{ fontSize: { xs: 21, sm: 31 } }}>
              {parse(DOMPurify.sanitize(data.introductionPage.title))}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: 19, sm: 22 } }}>
              {parse(DOMPurify.sanitize(data.introductionPage.subtitle))}
            </Typography>
          </Stack>
        </Stack>
        {/* Description */}
        <Stack spacing={6}>
          <Typography variant="body2">
            {parse(DOMPurify.sanitize(data.introductionPage.introduction))}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 3, sm: 0 }}
            sx={{ justifyContent: { sm: "space-evenly" } }}
          >
            <AppButton
              name={data.introductionPage.continueButton}
              onClick={() => navigate("/form")}
            />
          </Stack>
        </Stack>
      </Stack>

      <Footer />
    </Stack>
  );
};
