import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Header } from "./Header";
import logo from "assets/images/logo.png";
import Accord from "../Accord/Accord";
import { useHistory } from "react-router-dom";
import { GppGood, Inventory2, Badge, AddBusiness } from "@mui/icons-material";
// import { AppContext } from "context/AppContext";

const drawerWidth = 240;

export function Sidebar({ children, routes }) {
  // const { userData } = React.useContext(AppContext);
  // const role = userData?.user?.role ?? 3;
  // const isOutlet = role === 3;

  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const history = useHistory();

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    history.push(index);
  };
  const Icon = (indx, index) => {
    return indx === 0 ? (
      index === 0 ? (
        <Inventory2 />
      ) : index === 1 ? (
        <GppGood />
      ) : (
        <AddBusiness />
      )
    ) : (
      <Badge />
    );
  };
  const listRender = () => {
    return routes.map((item, indx) => {
      if (item?.layout) {
        return null;
      }
      return (
        <Accord active={indx === 0} title={item?.name} key={indx}>
          <List>
            {item?.views.map((prop, index) => {
              return (
                <ListItem
                  button
                  key={prop?.name}
                  selected={selectedIndex === prop.layout + prop.path}
                  onClick={() => handleListItemClick(prop.layout + prop.path)}
                >
                  <ListItemIcon>{prop?.icon()}</ListItemIcon>
                  <ListItemText sx={{ ml: -2 }} primary={prop?.name} />
                </ListItem>
              );
            })}
          </List>
        </Accord>
      );
    });
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header />
      <Box
        component="main"
        sx={{
          display: "flex",
          width: window.innerWidth - drawerWidth,
          height: window.innerHeight - 64,
          mt: 8,
        }}
      >
        {children}
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#D1E8E4",
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <Toolbar style={{ justifyContent: "center" }}>
          <img src={logo} alt="" style={{ width: 150, height: 60 }} />
        </Toolbar>
        {listRender()}
      </Drawer>
    </Box>
  );
}
