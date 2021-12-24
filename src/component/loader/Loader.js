import React from "react";
import { Box } from "@mui/system";
import { LinearProgress, Skeleton } from "@mui/material";

export const Loader = ({ children, load }) => {
  return (
    <Box sx={{ width: "100%", overflow: "scroll" }}>
      {load ? (
        <Box
          sx={{
            width: window.innerWidth - 240,
            height: window.innerHeight - 60,
          }}
        >
          <LinearProgress
            sx={{
              m: 0,
              p: 0,
              position: "fixed",
              top: 64,
              width: window.innerWidth - 240,
            }}
          />
          <Box
            spacing={1}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: window.innerWidth - 240,
              height: window.innerHeight - 60,
            }}
          >
            <Skeleton
              variant="text"
              height={90}
              width={window.innerWidth - 280}
            />
            <Skeleton
              variant="rectangular"
              width={window.innerWidth - 280}
              height={window.innerHeight - 175}
            />
          </Box>
        </Box>
      ) : (
        children
      )}
    </Box>
  );
};
