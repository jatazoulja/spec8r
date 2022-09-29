import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DashboardCreateCollectionController({
  handleAddCollection,
  open,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const saveCollection = () => {
    console.log({ name, description });
    window.ipcRenderer.send("SaveToJson", {
      action: "new:collection",
      data: { name, description },
    });
    window.ipcRenderer.on("add:collection", (event, arg) => {
      handleAddCollection();
      window.ipcRenderer.send("ListCollection", {
        action: "list:collection",
        data: {},
      });
    });
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
