import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TerminalIcon from "@mui/icons-material/Terminal";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/system";
export default function DashboardCreateServerController({
  handleAddServer,
  open,
}) {
  const [packageJSON, setPackageJSON] = React.useState({});
  const hanleOpenFolder = () => {
    window.ipcRenderer.send("DialogSelectFolder", { action: "add:server" });
  };
  window.ipcRenderer.on("add:server", (e, arg) => {
    console.log(JSON.parse(arg.data));
    setPackageJSON(JSON.parse(arg.data));
  });

  const displayScripts = (scripts) =>
    Object.keys(scripts).map((el, i) => (
      <Chip key={i + el} icon={<TerminalIcon />} label={el} />
    ));

  return (
    <Dialog open={open} onClose={handleAddServer}>
      <DialogTitle>Create New Servers</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        {"name" in packageJSON && (
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Package name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={packageJSON.name}
          />
        )}
        {"version" in packageJSON && (
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Version"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={packageJSON.version}
          />
        )}
        {"scripts" in packageJSON && (
          <Box>
            Runable Scripts:
            <Stack direction="row" spacing={1}>
              {displayScripts(packageJSON.scripts)}
            </Stack>
          </Box>
        )}
        {"dependencies" in packageJSON && (
          <Box>
            Dependencies Scripts:
            <Stack direction="row" spacing={1}>
              {displayScripts(packageJSON.dependencies)}
            </Stack>
          </Box>
        )}
        {"devDependencies" in packageJSON && (
          <Box>
            Dev Dependencies Scripts:
            <Stack direction="row" spacing={1}>
              {displayScripts(packageJSON.devDependencies)}
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={hanleOpenFolder}>Cancel</Button>
        <Button onClick={handleAddServer}>Add Server</Button>
      </DialogActions>
    </Dialog>
  );
}
