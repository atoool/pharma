import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function Modal({
  open = false,
  handleClose = () => {},
  handleAddRow = () => {},
  title = "",
  page = "product",
  renderItem = () => {},
}) {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          {page === "issue" && (
            <Button variant="contained" onClick={handleClose} sx={{ mr: 1 }}>
              {"Print & Issue"}
            </Button>
          )}
          {page !== "product" && (
            <Button variant="contained" onClick={handleAddRow} sx={{ mr: 1 }}>
              Add row
            </Button>
          )}
          <Button variant="contained" onClick={() => handleClose("submit")}>
            {page.indexOf("product") > -1
              ? "Submit"
              : page === "issue"
              ? "Issue"
              : "Send Req"}
          </Button>
        </Toolbar>
      </AppBar>
      {renderItem()}
    </Dialog>
  );
}
