import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { addCollection } from "../Service/DashboardElectronServices";
import { useDashboardCollectionContextContext } from "../Context/DashboardCollectionContext";
export default function DashboardCreateCollectionController({
  handleAddCollection,
  open,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { dashboardCollectionContextDispatch } =
    useDashboardCollectionContextContext();

  const saveCollection = () => {
    console.log({ name, description });
    addCollection({ name, description }, dashboardCollectionContextDispatch);
    handleAddCollection(false);
  };
  return (
    <Dialog open={open} onClose={handleAddCollection}>
      <DialogTitle>Create New Collection</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add Collection of node servers, Collections can be projects or micro
          services
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Collection Name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Collection Description"
          type="email"
          multiline
          rows={4}
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddCollection}>Cancel</Button>
        <Button onClick={saveCollection}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
