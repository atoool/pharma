import Lottie from "lottie-web";
import React from "react";
import service from "assets/lottie/service.json";
import { Box } from "@mui/system";

export const EmptyContent = () => {
  React.useEffect(() => {
    Lottie.loadAnimation({
      animationData: service,
      container: document.querySelector("#under-service"),
      renderer: "svg",
    });
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: window.innerWidth - 260,
        height: window.innerHeight - 120,
      }}
    >
      <div id="under-service" style={{ width: "30%" }} />
    </Box>
  );
};
