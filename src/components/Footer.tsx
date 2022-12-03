import { Link, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { data } from "src/utils/data";

export const Footer = () => {
  return (
    <Stack
      sx={{
        bgcolor: "primary.main",
        "& .MuiTypography-root": {
          color: "white",
        },
        minHeight: "150px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={2} sx={{ px: { xs: 2, sm: 0 } }}>
        <Typography variant="body2">
          {parse(DOMPurify.sanitize(data.footer.footerTop))}
        </Typography>
        <Typography variant="body2">
          {parse(DOMPurify.sanitize(data.footer.footerBottom))}
          <Link
            sx={{ cursor: "pointer", "&:hover": { color: "secondary.main" } }}
            onClick={() =>
              window.open(data.url.link.smallworldofwords, "_blank")
            }
          >
            {parse(DOMPurify.sanitize(data.url.html.smallworldofwords))}
          </Link>
        </Typography>
      </Stack>
    </Stack>
  );
};
