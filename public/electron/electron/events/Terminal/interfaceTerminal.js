const pty = require("node-pty");
const os = require("os");
var shell = os.platform() === "win32" ? "powershell.exe" : "bash";
var ptyProcess = {};

async function InitTerminal(e, a, instanceId) {
  ptyProcess[instanceId] = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: a.path,
    env: process.env,
  });
  ptyProcess[instanceId].write(`npm run ${a.runable}\r`);

  ptyProcess[instanceId].on("data", function (data) {
    e.sender.send("terminal.incomingData" + instanceId, data);
  });
  // console.log(ptyProcess[a.instanceId]);
}

module.exports = (e, a) => {
  switch (a.action) {
    case "terminal.keystroke":
      console.log(a.instanceId);
      ptyProcess[a.instanceId].write(a.data);
      break;
    case "terminal.init":
      console.log(a.instanceId);
      InitTerminal(e, a.data, a.instanceId);
      break;
    default:
      console.log(a);
      InitTerminal(e, a);
      break;
  }
};
