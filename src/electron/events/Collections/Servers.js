const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { v4: uuidv4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");

async function readServerFolder(dir) {
  var files = fs.readdirSync(dir);
  const server = [];
  for (var i in files) {
    var name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) continue;
    if (files[i] === "index.json") continue;
    server.push(files[i]);
  }

  return server;
}
async function readServerFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", function (err, data) {
      if (err) throw reject(err);
      resolve(data);
    });
  });
}
async function readFileFromFolder(dir, folder) {
  let serverArray = [];
  return new Promise(async (res, rej) => {
    try {
      for (const file of folder) {
        const contents = await readServerFile(path.join(dir, file));
        serverArray.push({ ...JSON.parse(contents) });
      }
      res(serverArray);
    } catch (error) {
      rej(error);
    }
  });
}

async function listServer(e, data) {
  // const currentTime = Temporal.Now.instant().epochMilliseconds;
  const dir = app.getAppPath();
  const servers = path.join(dir, "collections", data.collectionId);

  if (!fs.existsSync(servers)) {
    e.returnValue = {
      error: true,
      message: "Collection does not exist",
    };
    return;
  }

  try {
    const serverList = await readServerFolder(servers);
    if (serverList.length === 0) {
      e.returnValue = {
        action: "list:server",
        data: [],
      };
      return;
    }
    const list = await readFileFromFolder(servers, serverList);
    e.returnValue = {
      action: "list:server",
      data: list,
    };
    return;
  } catch (error) {
    console.error(error);
    e.returnValue = {
      error: true,
      message: "Failed to list Server",
      stack: error,
    };
  }
}

async function editServer(e, data) {
  const currentTime = Temporal.Now.instant().epochMilliseconds;
  const dir = app.getAppPath();
  const server = path.join(dir, "servers", data.id, "index.json");

  if (!fs.existsSync(server)) {
    e.returnValue = {
      error: true,
      message: "Unable to edit server",
    };
    return;
  }
  try {
    const serverData = await fs.writeFileSync(
      server,
      JSON.stringify({ ...data, modifiedDate: currentTime }),
      "utf-8"
    );
    console.log(serverData);
    e.returnValue = {
      action: "edit:server",
      data: data,
    };
    return;
  } catch (error) {
    console.error(error);
    e.returnValue = {
      error: true,
      message: "Failed to write file",
      stack: error,
    };
  }
}
async function addServer(e, content, collectionId) {
  const currentTime = Temporal.Now.instant().epochMilliseconds;
  const dir = app.getAppPath();
  const newServer = {
    ...content,
    id: uuidv4(),
    modifiedDate: currentTime,
    createdDate: currentTime,
  };
  const serverPathName = path.join(
    dir,
    "collections",
    collectionId,
    newServer.id + ".json"
  );

  try {
    fs.writeFileSync(serverPathName, JSON.stringify(newServer));
    e.returnValue = {
      action: "add:server",
      data: newServer,
    };
  } catch (error) {
    console.error(error);
    e.returnValue = {
      error: true,
      message: "Failed to write file",
      stack: error,
    };
  }
}
async function loadServerJson(e, data) {
  const file = path.join(data.filepath, "package.json");
  console.log(file);
  if (!fs.existsSync(file)) {
    e.returnValue = {
      error: true,
      message: `${file} does not exist`,
    };
    return;
  }
  try {
    const packageJson = fs.readFileSync(file, "utf-8");
    console.log(packageJson);

    e.returnValue = {
      action: "load:json",
      data: JSON.parse(packageJson),
    };
  } catch (error) {
    e.returnValue = {
      error: true,
      message: "Failed to write file",
      stack: error,
    };
    console.error(error);
  }
}
module.exports = (e, a) => {
  switch (a.action) {
    case "add:server":
      addServer(e, a.data, a.collectionId);
      break;
    case "load:json":
      loadServerJson(e, a.data, a.collectionId);
      break;
    case "list:server":
      listServer(e, a.data);
      break;
    // case "edit:server":
    //   editServer(e, a.data);
    //   break;
    default:
      e.returnValue = {
        error: true,
        message: "no action attached",
      };
      break;
  }
};
