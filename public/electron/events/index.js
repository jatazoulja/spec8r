const { ipcMain } = require("electron");
const SaveToJson = require("./SaveJsonTofile");
const ListCollection = require("./Collections/listCollections");
const DialogSelectFolder = require("./DialogSelectFolder");
const TerminalInterface = require("./Terminal/interfaceTerminal");
const eventStore = {
  SaveToJson,
  ListCollection,
  DialogSelectFolder,
  TerminalInterface,
};

const webContentsEventStore = [];

module.exports = (mainWindow) => {
  if (!!Object.keys.length) {
    for (let [key, val] of Object.entries(eventStore)) {
      if (!ipcMain.eventNames().includes(key)) {
        console.log({ key, val });
        ipcMain.on(key, (e, a) => val(e, a));
      }
    }
  }

  if (!!webContentsEventStore.length) {
    webContentsEventStore.forEach((e) => {
      mainWindow.webContents.on(e.subject, e.fn, mainWindow);
    });
  }
};