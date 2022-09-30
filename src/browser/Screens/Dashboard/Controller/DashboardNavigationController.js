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
import ImportantDevicesRoundedIcon from "@mui/icons-material/ImportantDevicesRounded";
import { useNavigate } from "react-router-dom";
import DashboardCreateCollectionController from "./DashboardCreateCollectionController";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import PhonelinkOffRoundedIcon from "@mui/icons-material/PhonelinkOffRounded";
import { pink } from "@mui/material/colors";

import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useDashboardCollectionContextContext } from "../Context/DashboardCollectionContext";
import { listAllCollections } from "../Service/DashboardElectronServices";
import DashboardCollectionMenuController from "./DashboardCollectionMenuController";

export default function DashboardNavigationController() {
  const [openCreateCollection, setOpenCreateCollection] = React.useState(false);
  const [selectedCollection, setSelectedCollection] = React.useState({});
  const [openCollectionActive, setOpenCollectionActive] = React.useState(true);
  const [openArchivedCollectionActive, setOpenArchivedCollectionActive] =
    React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const preventMultiRender = useRef(false);
  const handleMenuClick = (event, elem) => {
    setSelectedCollection(elem);
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

  const elemCollections = (active) => {
    if (!dashboardCollectionContextState.length) return null;

    return dashboardCollectionContextState.map((elem) => {
      const isFavorite = elem.favorite || false;
      const archived = elem.archived || false;
      if (active === archived) return false;
      return (
        <ListItem key={elem.id} disablePadding>
          <ListItemButton>
            <ListItemIcon
              onClick={(e) =>
                handleClick(`/collection/${elem.id}`, { state: elem })
              }
            >
              {!isFavorite ? (
                <DevicesRoundedIcon />
              ) : (
                <ImportantDevicesRoundedIcon sx={{ color: pink[500] }} />
              )}
            </ListItemIcon>
            <ListItemText
              onClick={(e) =>
                handleClick(`/collection/${elem.id}`, { state: elem })
              }
              primary={elem.name || "N/A"}
            />
            <IconButton
              onClick={(e) => handleMenuClick(e, elem)}
              aria-label="fingerprint"
              color="default"
            >
              <MoreVertIcon />
            </IconButton>
          </ListItemButton>
        </ListItem>
      );
    });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <DashboardCollectionMenuController
        open={open}
        collection={selectedCollection}
        handleClose={handleClose}
        anchorEl={anchorEl}
      />
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
        </List>
      </nav>
      <Divider />
      <ListItemButton
        onClick={() => setOpenCollectionActive(!openCollectionActive)}
      >
        <ListItemIcon>
          <DevicesRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Active Collection" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <nav aria-label="secondary mailbox folders">
        <Collapse in={openCollectionActive} timeout="auto" unmountOnExit>
          <List>{elemCollections(true)}</List>
        </Collapse>
      </nav>
      <Divider />
      <ListItemButton
        onClick={() =>
          setOpenArchivedCollectionActive(!openArchivedCollectionActive)
        }
      >
        <ListItemIcon>
          <PhonelinkOffRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Archived" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <nav aria-label="secondary mailbox folders">
        <Collapse
          in={openArchivedCollectionActive}
          timeout="auto"
          unmountOnExit
        >
          <List>{elemCollections(false)}</List>
        </Collapse>
      </nav>
    </Box>
  );
}
