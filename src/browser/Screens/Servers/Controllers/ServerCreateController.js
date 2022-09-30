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
import Grid from "@mui/material/Grid";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/system";

import { useServersContextContext } from "../Context/ServersContext";
import { addServer } from "../Service/ServerService";

export default function ServerCreateController({ open, close, collection }) {
  const [packageJSON, setPackageJSON] = React.useState({});
  const [folderPath, setFolderPath] = React.useState({});

  const {
    serversContextState,
    serversContextDispatch,
    isLoading,
    setIsLoading,
  } = useServersContextContext();

  const handleAddServer = (newPackage) => {
    console.log(newPackage);
    addServer(collection.id, newPackage, serversContextDispatch);
    close();

    // window.ipcRenderer.send("Servers", {
    //   action: "edit:collection",
    //   filename: `${temp.id}.json`,
    //   data: temp,
    // });
    // window.ipcRenderer.send("ListCollection", {
    //   action: "list:collection",
    //   data: {},
    // });
  };
  const hanleOpenFolder = () => {
    window.ipcRenderer.send("DialogSelectFolder", { action: "add:server" });
  };
  window.ipcRenderer.on("add:server", (e, arg) => {
    setFolderPath(arg.filePath);
    setPackageJSON(JSON.parse(arg.data));
  });
  // window.ipcRenderer.on("edit:collection", (e, arg) => {
  //   console.log(arg);
  // });
  const displayScripts = (scripts) =>
    Object.keys(scripts).map((el, i) => (
      <Chip key={i + el} icon={<TerminalIcon />} label={el} />
    ));
  const descriptionElementRef = React.useRef(null);

  React.useEffect(() => {
    console.log({
      collection,
      servers: !Object.keys(collection).includes("servers"),
    });

    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={() => setPackageJSON({})}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle>Create New Servers</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText
          id="scroll-dialog-description"
          tabIndex={-1}
          ref={descriptionElementRef}
        >
          <Grid container spacing={2}>
            {"name" in packageJSON && (
              <Grid item xs={12}>
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
              </Grid>
            )}
            {"version" in packageJSON && (
              <Grid item xs={12}>
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
              </Grid>
            )}
            {"scripts" in packageJSON && (
              <Grid item xs={12}>
                <Box>
                  Runable Scripts:
                  <Stack direction="row" spacing={1}>
                    {displayScripts(packageJSON.scripts)}
                  </Stack>
                </Box>
              </Grid>
            )}
            {"dependencies" in packageJSON && (
              <Grid item xs={12}>
                <Box>
                  Dependencies Scripts:
                  <Stack direction="row" spacing={1}>
                    {displayScripts(packageJSON.dependencies)}
                  </Stack>
                </Box>
              </Grid>
            )}
            {"devDependencies" in packageJSON && (
              <Grid item xs={12}>
                <Box>
                  Dev Dependencies Scripts:
                  <Stack direction="row" spacing={1}>
                    {displayScripts(packageJSON.devDependencies)}
                  </Stack>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                onClick={hanleOpenFolder}
                variant="outlined"
                startIcon={<FolderOpenOutlinedIcon />}
              >
                Open Folder
              </Button>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button
          onClick={() => {
            const { name, scripts, version } = packageJSON;
            const temp = {
              name,
              version,
              scripts,
              path: folderPath,
            };
            console.log(temp);
            handleAddServer(temp);
          }}
        >
          Add Server
        </Button>
      </DialogActions>
    </Dialog>
  );
}
