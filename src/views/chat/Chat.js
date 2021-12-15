import React from "react";
import {
  Widget,
  addResponseMessage,
  addUserMessage,
  dropMessages,
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import "./Chat.css";
import { Button, Box } from "@mui/material";
import { AccountCircleRounded } from "@mui/icons-material";
import { AppContext } from "../../context/AppContext";
import { get, post } from "../../api/api";

export const Chat = () => {
  const { drawer, userData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [chat, setChat] = React.useState({ chatId: "", title: "" });
  const [users, setUsers] = React.useState([]);
  const getUserList = async () => {
    try {
      const data = await get("users-messages", token);
      setUsers(data?.data?.response ?? []);
    } catch {}
  };
  React.useEffect(() => {
    getUserList();
  }, []);

  const handleNewUserMessage = async (newMessage) => {
    try {
      const data = { receiverId: chat?.chatId, message: newMessage };
      await post("add-message", token, data);
    } catch {}
  };

  const onSelectChat = async (handleToggle, user) => {
    try {
      setChat({ chatId: user?.id, title: user?.name });
      const data = await get("list-messages/" + user?.id, token);
      const messages = data?.data?.response ?? [];
      messages &&
        messages?.length > 0 &&
        messages?.map((itm) => {
          if (itm?.position === "right") {
            addUserMessage(itm?.message);
          } else {
            addResponseMessage(itm?.message);
          }
        });

      handleToggle();
    } catch {}
  };

  const getCustomLauncher = (handleToggle) => {
    return users?.map((itm, i) => (
      <Box
        key={i}
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
          onClick={() => onSelectChat(handleToggle, itm)}
          startIcon={<AccountCircleRounded sx={{ height: 50, width: 50 }} />}
        >
          {itm?.name}
        </Button>
      </Box>
    ));
  };

  const handleToggles = (status) => {
    if (!status) {
      dropMessages();
    }
  };

  return (
    <Box>
      <Widget
        emojis={false}
        subtitle=""
        title={chat?.title}
        fullScreenMode={true}
        launcher={(handleToggle) => getCustomLauncher(handleToggle)}
        handleNewUserMessage={handleNewUserMessage}
        handleToggle={handleToggles}
        showTimeStamp={false}
      />
    </Box>
  );
};
