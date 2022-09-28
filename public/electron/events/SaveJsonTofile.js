const fs = require("fs");
const path = require("path");
const { app } = require("electron");

// const { Temporal } = require("@js-temporal/polyfill");
const { v4: uuidv4 } = require("uuid");

async function saveJsonToFile(e, data) {
  // const currentTime = Temporal.Now.instant().epochMilliseconds;
  const id = uuidv4();
  const dir = app.getAppPath();

  if (!fs.existsSync(path.join(dir, "collections"))) {
    fs.mkdirSync(path.join(dir, "collections"));
  }

  const file = path.join(dir, "collections", `${id}.json`);
  try {
    fs.writeFileSync(file, JSON.stringify(data), "utf-8");
    e.sender.send("add:collection", {
      action: "add:collection:success",
    });
  } catch (error) {
    e.sender.send("edit:collection", {
      error: true,
      message: "Fail to write file",
      stack: error,
    });
    console.error(error, "Failed to save the file !");
  }
}
async function loadJsonFromFile(e, data, filepath) {
  const file = path.join(filepath, "package.json");

  if (!fs.existsSync(file))
    e.sender.send("edit:collection", {
      error: true,
      message: "no package file",
    });

  try {
    const packageJson = fs.readFileSync(file, "utf-8");
    e.sender.send("load:server", {
      action: "add:collection:success",
      packageJson: JSON.parse(packageJson),
    });
  } catch (error) {
    e.sender.send("edit:collection", {
      error: true,
      message: "Fail to read file",
      stack: error,
    });
    console.error(error, "Failed to save the file !");
  }
}
async function editJsonToFile(e, content, filename) {
  const dir = app.getAppPath();
  try {
    console.log(path.join(dir, "collections", filename));
    if (!fs.existsSync(path.join(dir, "collections", filename)))
      return e.sender.send("edit:collection", {
        error: true,
        message: "File Does not exist",
      });
    console.log(path.join(dir, "collections", filename));
    fs.writeFileSync(
      path.join(dir, "collections", filename),
      JSON.stringify(content)
    );
    e.sender.send("edit:collection", {
      action: "edit:collection:success",
    });
  } catch (error) {
    console.error(error);
    e.sender.send("edit:collection", {
      error: true,
      message: "Fail to write file",
      stack: error,
    });
  }
}
module.exports = (e, a) => {
  switch (a.action) {
    case "edit:collection":
      console.log(a);
      editJsonToFile(e, a.data, a.filename);
      break;
    case "load:server":
      console.log(a);
      loadJsonFromFile(e, a.data, a.data.path);
      break;
    default:
    //saveJsonToFile(e, a.data);
  }
};
