import * as React from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@mui/material";
import _ from "lodash";

import { useServersContextContext } from "../Context/ServersContext";
import { loadServerJson } from "../Service/ServerService";

export default function ServerTerminalController({ server, instanceId }) {
  const terminalBox = React.useRef();
  const effectRan = React.useRef(false);
  var term = new Terminal();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [runable, setRunable] = React.useState([]);
  const open = Boolean(anchorEl);

  const { serversContextState, serversContextDispatch } =
    useServersContextContext();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    if (effectRan.current === false) {
      loadServerJson(server, serversContextDispatch);
      return () => {
        effectRan.current = true;
      };
    }
  }, []);
  console.log(instanceId);
  React.useEffect(() => {
    let selectedServer = _.filter(serversContextState.data, { id: instanceId });
    console.log(selectedServer[0].script);
    setRunable(selectedServer[0].scripts);
  }, [serversContextState]);

  const handleRunTerminal = (run) => {
    if (!("path" in server)) return;
    console.log({ ...server, runable: run });
    if (terminalBox.current.getElementsByClassName("terminal").length === 1)
      return;

    term.open(terminalBox.current);
    window.ipcRenderer.send("TerminalInterface", {
      action: "terminal.init",
      data: { ...server, runable: run },
      instanceId,
    });
    setAnchorEl(null);
    term.onData((e) => {
      console.log(e);
      window.ipcRenderer.send("TerminalInterface", {
        action: "terminal.keystroke",
        data: e,
        instanceId,
      });
    });
    window.ipcRenderer.on(
      "terminal.incomingData" + instanceId,
      (event, data) => {
        term.write(data);
      }
    );
  };

  // if (!("scripts" in serversContextState)) return null;
  return (
    <Card lg={{ minWidth: 500 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {server.name}
        </Typography>
        <Typography sx={{ fontSize: 10 }} color="text.secondary" gutterBottom>
          {server.version}
        </Typography>
        <div id={"xterm" + instanceId} ref={terminalBox} />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleClick}>
          Learn More
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {runable.map((run, i) => (
            <MenuItem key={i + run} onClick={() => handleRunTerminal(run)}>
              {run}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem key="instanceId" onClick={() => handleRunTerminal()}>
            Close
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
}
