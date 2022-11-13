import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import NUS_Logo from "src/assets/images/NUS_Logo.png";
import { AppButton } from "src/components/AppButton";
import { Footer } from "src/components/Footer";
import { PopoverButton } from "src/components/PopoverButton";
import { data } from "src/utils/data";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={5} sx={{ minHeight: "100vh" }}>
      <Stack sx={{ width: "60%", alignSelf: "center", flex: 1 }}>
        {/* Title */}
        <Stack direction="row" sx={{ justifyContent: "center" }}>
          <Box
            component="img"
            src={NUS_Logo}
            sx={{ width: "30%", height: "50%" }}
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
            <Typography variant="h2" sx={{ fontSize: 31 }}>
              {parse(DOMPurify.sanitize(data.introductionPage.title))}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: 22 }}>
              {parse(DOMPurify.sanitize(data.introductionPage.subtitle))}
            </Typography>
          </Stack>
        </Stack>

        {/* Description */}
        <Stack spacing={6}>
          <Typography variant="body2">
            {parse(DOMPurify.sanitize(data.introductionPage.introduction))}
          </Typography>
          <Stack direction="row" sx={{ justifyContent: "space-evenly" }}>
            <PopoverButton
              name={data.introductionPage.luckyDrawButton}
              description={data.introductionPage.luckyDrawDescription}
            />
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
