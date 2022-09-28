// ./public/electron.js
const path = require("path");
const { app, BrowserWindow, screen } = require("electron");
const isDev = require("electron-is-dev");
const listners = require("./electron/events");

app.disableHardwareAcceleration();

function createWindow() {
  const waObj = screen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  const win = new BrowserWindow({
    width: waObj.width,
    height: waObj.height,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      webSecurity: false,
      preload: path.join(__dirname + "/electron", "preload.js"),
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
  console.log(listners);
  listners(win);
  return win;
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
