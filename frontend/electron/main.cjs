const { app, BrowserWindow } = require("electron");
const path = require("path");
const { fork } = require("child_process");

let backendProcess;

function getBackendPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "backend", "dist", "main.js");
  }

  return path.join(__dirname, "../../backend/dist/main.js");
}

function startBackend() {
  const backendPath = getBackendPath();

  backendProcess = fork(backendPath, [], {
    env: {
      ...process.env,
      PORT: "3000",
    },
    stdio: "inherit",
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  win.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
