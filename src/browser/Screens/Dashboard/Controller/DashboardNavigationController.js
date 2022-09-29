import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import { useNavigate } from "react-router-dom";
import DashboardCreateCollectionController from "./DashboardCreateCollectionController";

export default function DashboardNavigationController() {
  const [openCreateCollection, setOpenCreateCollection] = React.useState(false);
  const [listCollections, setListCollections] = React.useState([]);
  let handleClick = useNavigate();
  useEffect(() => {
    window.ipcRenderer.send("ListCollection", {
      action: "list:collection",
      data: {},
    });
  }, []);

  window.ipcRenderer.on("list:collection", (event, arg) => {
    setListCollections(arg.data);
  });
  const handleAddCollection = () => {
    setOpenCreateCollection(!openCreateCollection);
  };

  const elemCollections = () => {
    if (!listCollections.length) return null;

    return listCollections.map((elem) => (
      <ListItem
        key={elem.id}
        disablePadding
        onClick={(e) => handleClick(`/collection/${elem.id}`, { state: elem })}
      >
        <ListItemButton>
          <ListItemIcon>
            <DevicesRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={elem.name || "N/A"} />
        </ListItemButton>
      </ListItem>
    ));
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {/* <DashboardCreateServerController
        handleAddServer={() => handleAddServer()}
        open={openCreateServer}
      /> */}
      <DashboardCreateCollectionController
        handleAddCollection={() => handleAddCollection()}
        open={openCreateCollection}
      />
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem
            disablePadding
            onClick={(e) => {
              handleAddCollection();
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <CreateNewFolderIcon />
              </ListItemIcon>
              <ListItemText primary="Create Collection" />
            </ListItemButton>
          </ListItem>
          {/* <ListItem
            disablePadding
            onClick={(e) => {
              handleAddServer();
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <AddHomeWorkIcon />
              </ListItemIcon>
              <ListItemText primary="Add Server" />
            </ListItemButton>
          </ListItem> */}
        </List>
      </nav>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List>{elemCollections()}</List>
      </nav>
    </Box>
  );
}
