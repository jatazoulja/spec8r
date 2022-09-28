const fs = require("fs");
const path = require("path");
const { app } = require("electron");

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
  if (!fs.existsSync(collections)) {
    fs.mkdirSync(collections);
  }

  try {
    const collectionList = await readCollectionFolder(collections);
    const list = await readFileFromFolder(collections, collectionList);
    e.sender.send("list:collection", {
      action: "list:collection",
      data: list,
    });
  } catch (error) {}
}

module.exports = (e, a) => {
  listCollection(e, a.data);
};
