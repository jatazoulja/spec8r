const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { v4: uuidv4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");

async function readCollectionFolder(dir) {
  var files = fs.readdirSync(dir);
  const directory = [];
  for (var i in files) {
    var name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      directory.push(files[i]);
    }
  }

  return directory;
}
async function readCollectionFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", function (err, data) {
      if (err) throw reject(err);
      resolve(data);
    });
  });
}
async function readFileFromFolder(dir, folder) {
  let collectionArray = [];
  return new Promise(async (res, rej) => {
    try {
      for (const file of folder) {
        const contents = await readCollectionFile(
          path.join(dir, file, "index.json")
        );
        collectionArray.push({
          id: file.replace(".json", ""),
          ...JSON.parse(contents),
        });
      }

      console.log(collectionArray);
      res(collectionArray);
    } catch (error) {
      rej(error);
    }
  });
}

async function listCollection(e, data) {
  // const currentTime = Temporal.Now.instant().epochMilliseconds;
  const dir = app.getAppPath();
  const collections = path.join(dir, "collections");

  if (!fs.existsSync(collections)) {
    fs.mkdirSync(collections);
  }

  try {
    const collectionList = await readCollectionFolder(collections);

    const list = await readFileFromFolder(collections, collectionList);
    e.returnValue = {
      action: "list:collection",
      data: list,
    };
    return;
  } catch (error) {
    console.error(error);
    e.returnValue = {
      error: true,
      message: "Failed to list Collection",
      stack: error,
    };
  }
}

async function editCollection(e, data) {
  const currentTime = Temporal.Now.instant().epochMilliseconds;
  const dir = app.getAppPath();
  const collection = path.join(dir, "collections", data.id, "index.json");

  if (!fs.existsSync(collection)) {
    e.returnValue = {
      error: true,
      message: "Unable to edit collection",
    };
    return;
  }
  try {
    const collectionData = await fs.writeFileSync(
      collection,
      JSON.stringify({ ...data, modifiedDate: currentTime }),
      "utf-8"
    );
    console.debug(collectionData);
    e.returnValue = {
      action: "edit:collection",
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
async function addCollection(e, content) {
  const currentTime = Temporal.Now.instant().epochMilliseconds;
  const dir = app.getAppPath();
  const newCollection = {
    ...content,
    id: uuidv4(),
    modifiedDate: currentTime,
    createdDate: currentTime,
  };

  try {
    if (!fs.existsSync(path.join(dir, "collections"))) {
      fs.mkdirSync(path.join(dir, "collections"));
    }
    fs.mkdirSync(path.join(dir, "collections", newCollection.id));
    fs.writeFileSync(
      path.join(dir, "collections", newCollection.id, "index.json"),
      JSON.stringify(newCollection)
    );
    e.returnValue = {
      action: "add:collection",
      data: newCollection,
    };
  } catch (error) {
    console.error(error);
    e.sender.send("add:collection", {
      error: true,
      message: "Failed to write file",
      stack: error,
    });
  }
}
module.exports = (e, a) => {
  switch (a.action) {
    case "add:collection":
      addCollection(e, a.data);
      break;
    case "list:collection":
      listCollection(e, a.data);
      break;
    case "edit:collection":
      editCollection(e, a.data);
      break;
    default:
      e.returnValue = {
        error: true,
        message: "no action attached",
      };
      break;
  }
};
