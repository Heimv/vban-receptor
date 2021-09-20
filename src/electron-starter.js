const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const path = require("path");

let front;
let back;

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  });

  win.loadURL(!app.isPackaged ? "http://localhost:3000" : `file:${path.join(__dirname, "../index.html")}`);

  win.once("ready-to-show", () => {
    win.show();
  });

  win.on("closed", () => {
    win = null;
  });
  win.setTitle("Vban receptor");
}

app.whenReady().then(() => {
  front = exec("npm run start", (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }
    console.log(stdout);
    console.log(stderr);
  });
  back = exec("npm run backend", (err, stdout) => {
    if (err) {
      console.log(err);
    }
    console.log(stdout);
  });
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  front.kill("SIGKILL");
  back.kill("SIGKILL");
  if (process.platform !== "darwin") {
    app.quit();
  }
});
