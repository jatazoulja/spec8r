import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Divider from "@mui/material/Divider";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import { setFavorite, setArchived } from "../Service/DashboardElectronServices";
import { useDashboardCollectionContextContext } from "../Context/DashboardCollectionContext";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    anchorEl={props.anchorEl}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function DashboardCollectionMenuController({
  anchorEl,
  open,
  handleClose,
  collection,
}) {
  const { dashboardCollectionContextDispatch } =
    useDashboardCollectionContextContext();
  const isFavorite = collection.favorite || false;
  const archived = collection.archived || false;

  const handleEdit = () => {
    handleClose();
    console.log(collection);
  };
  const handleInfo = () => {
    handleClose();
    console.log(collection);
  };
  const handleArchived = () => {
    setArchived(
      {
        ...collection,
        archived: !archived,
      },
      dashboardCollectionContextDispatch
    );
    handleClose();
  };
  const handleFavorite = () => {
    setFavorite(
      {
        ...collection,
        favorite: !isFavorite,
      },
      dashboardCollectionContextDispatch
    );
    handleClose();
  };
  return (
    <>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEdit} disableRipple>
          <ModeEditOutlineOutlinedIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={handleInfo} disableRipple>
          <InfoOutlinedIcon />
          Info
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleArchived} disableRipple>
          <ArchiveOutlinedIcon />
          Archive
        </MenuItem>
        <MenuItem onClick={handleFavorite} disableRipple>
          {isFavorite ? (
            <FavoriteOutlinedIcon />
          ) : (
            <FavoriteBorderOutlinedIcon />
          )}
          Favorite
        </MenuItem>
      </StyledMenu>
    </>
  );
}
