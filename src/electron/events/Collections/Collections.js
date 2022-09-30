const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { v4: uuidv4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");

async function readCollectionFolder(dir) {
  return new Promise((res, rej) => {
    fs.readdir(dir, function (err, list) {
      if (err) return rej(err);
      res(list);
    });
  });
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
    for (const file of folder) {
      const contents = await readCollectionFile(path.join(dir, file));
      collectionArray.push({
        id: file.replace(".json", ""),
        ...JSON.parse(contents),
      });
    }

    console.log(collectionArray);
    res(collectionArray);
  });
}

async function listCollection(e, data) {
  // const currentTime = Temporal.Now.instant().epochMilliseconds;
  const dir = app.getAppPath();
  const collections = path.join(dir, "collections");
  console.log(collections);
  if (!fs.existsSync(collections)) {
    fs.mkdirSync(collections);
  }

  try {
    const collectionList = await readCollectionFolder(collections);
    console.log(collectionList);

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
  const collection = path.join(dir, "collections", data.id + ".json");

  if (!fs.existsSync(collection)) {
    e.returnValue = {
      error: true,
      message: "no action attached",
    };
    return;
  }
  try {
    const collectionData = await fs.writeFileSync(
      collection,
      JSON.stringify({ ...data, modifiedDate: currentTime }),
      "utf-8"
    );
    console.log(collectionData);
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
    console.log(path.join(dir, "collections"));
    if (!fs.existsSync(path.join(dir, "collections"))) {
      fs.mkdirSync(path.join(dir, "collections"));
    }

    fs.writeFileSync(
      path.join(dir, "collections", newCollection.id + ".json"),
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
