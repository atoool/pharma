import React from "react";
import { Widget, addResponseMessage, dropMessages } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import "./Chat.css";
import { Button, Box } from "@mui/material";
import { AccountCircleRounded } from "@mui/icons-material";
import { AppContext } from "../../context/AppContext";

export const Chat = () => {
  const { drawer } = React.useContext(AppContext);

  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
  };

  const getCustomLauncher = (handleToggle) => (
    <Box
      sx={{
        p: 0.1,
        backgroundColor: "#e5e5e5",
        width: drawer ? window.innerWidth - 241 : window.innerWidth,
      }}
    >
      <Button
        sx={{
          p: 3,
          backgroundColor: "#fff",
          borderRadius: 0,
          width: drawer ? window.innerWidth - 241 : window.innerWidth,
        }}
        style={{ display: "flex", justifyContent: "flex-start" }}
        onClick={handleToggle}
        startIcon={<AccountCircleRounded sx={{ height: 50, width: 50 }} />}
      >
        Athul Mohan
      </Button>
    </Box>
  );

  return (
    <Box>
      <Widget
        emojis={false}
        subtitle=""
        fullScreenMode={true}
        launcher={(handleToggle) => getCustomLauncher(handleToggle)}
        handleNewUserMessage={handleNewUserMessage}
      />
    </Box>
  );
};
