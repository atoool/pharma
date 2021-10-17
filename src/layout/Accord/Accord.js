import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Accord({ children, title, active = false }) {
  return (
    <div>
      <Accordion
        elevation={0}
        sx={{
          bgcolor: "rgba(31, 160, 132, 0.03)",
          borderRadius: 0,
        }}
        defaultExpanded
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ fontWeight: "bold" }}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}
