import React, { useEffect, useRef } from "react";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";

import { useDashboardCollectionContextContext } from "../Context/DashboardCollectionContext";
import { listAllCollections } from "../Service/DashboardElectronServices";
import DashboardCollectionMenuController from "./DashboardCollectionMenuController";

export default function DashboardNavigationController() {
  const [openCreateCollection, setOpenCreateCollection] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const preventMultiRender = useRef(false);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const {
    dashboardCollectionContextState,
    dashboardCollectionContextDispatch,
  } = useDashboardCollectionContextContext();
  let handleClick = useNavigate();
  useEffect(() => {
    if (!preventMultiRender.current) {
      listAllCollections(dashboardCollectionContextDispatch);
      preventMultiRender.current = true;
    }
  }, []);

  const handleAddCollection = () => {
    setOpenCreateCollection(!openCreateCollection);
  };

  const elemCollections = () => {
    if (!dashboardCollectionContextState.length) return null;

    return dashboardCollectionContextState.map((elem) => (
      <ListItem key={elem.id} disablePadding>
        <ListItemButton>
          <ListItemIcon
            onClick={(e) =>
              handleClick(`/collection/${elem.id}`, { state: elem })
            }
          >
            <DevicesRoundedIcon />
          </ListItemIcon>
          <ListItemText
            onClick={(e) =>
              handleClick(`/collection/${elem.id}`, { state: elem })
            }
            primary={elem.name || "N/A"}
          />
          <IconButton
            onClick={handleMenuClick}
            aria-label="fingerprint"
            color="default"
          >
            <MoreVertIcon />
          </IconButton>
          <DashboardCollectionMenuController
            open={open}
            collection={elem}
            handleClose={handleClose}
            anchorEl={anchorEl}
          />
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
