import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

type ExpansionPanelProps = {
  header: string | JSX.Element | JSX.Element[];
  body: string | JSX.Element | JSX.Element[] | (string | JSX.Element)[][];
};

export const ExpansionPanel = ({
  header,
  body,
  ...rest
}: ExpansionPanelProps) => {
  return (
    <Accordion
      defaultExpanded={true}
      elevation={0}
      sx={{ border: "1px solid rgba(0,0,0,0.2)" }}
      {...rest}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          bgcolor: "primary.main",
          "&:hover": {
            bgcolor: "secondary.main",
          },
          "& .MuiAccordionSummary-expandIconWrapper": { color: "white" },
        }}
      >
        <Typography sx={{ color: "white", fontWeight: "bold" }}>
          {header}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography sx={{ whiteSpace: "pre-wrap" }}>{body}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};
