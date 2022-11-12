import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

type ExpansionPanelProps = {
  title: string;
};

export const ExpansionPanel = ({ title }: ExpansionPanelProps) => {
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
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
          consequat a lacus euismod vulputate. Quisque ut blandit lacus. Donec
          posuere odio ut consequat vestibulum. Nullam ligula diam, porttitor
          porta iaculis non, gravida sed leo. Suspendisse at nulla ultricies,
          viverra est posuere, finibus mauris. Integer tincidunt arcu eu mi
          malesuada condimentum. Donec eget venenatis nulla. Integer bibendum
          dictum lectus, a ultrices lorem ullamcorper non. Quisque vitae leo sit
          amet enim tristique mattis sed luctus est. Aliquam eget feugiat nisl,
          eu porta magna.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};
