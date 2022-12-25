import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

type ExpansionPanelProps = {
  panel: {
    header: string;
    body: string | (string | JSX.Element)[][];
  };
};

export const ExpansionPanel = ({ panel }: ExpansionPanelProps) => {
  return (
    <Accordion
      defaultExpanded={true}
      elevation={0}
      sx={{ border: "1px solid rgba(0,0,0,0.2)" }}
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
          {panel.header}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography sx={{ whiteSpace: "pre-wrap" }}>{panel.body}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};
