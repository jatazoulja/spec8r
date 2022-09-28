const dialog = require("electron").dialog;
const fs = require("fs");
const path = require("path");

async function addServerPackage(folder) {
  const packageJSON = path.join(folder, "package.json");
  return new Promise((res, rej) => {
    if (!fs.existsSync(packageJSON))
      rej({ error: true, message: "no package found" });

    fs.readFile(packageJSON, "utf8", function (err, data) {
      if (err) throw rej(err);
      res(data);
    });
  });
}

module.exports = async (e, a) => {
  console.log(a.action);
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (canceled) {
    return;
  } else {
    switch (a.action) {
      case "add:server":
        const packageJSON = await addServerPackage(filePaths[0]);
        e.sender.send("add:server", {
          action: "add:server",
          data: packageJSON,
          filePath: filePaths[0],
        });
        break;
      default:
        break;
    }
    return filePaths[0];
  }
};
