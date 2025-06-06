import { app, BrowserWindow, session, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow: BrowserWindow;

// Google Authentication Browserwindow config for electron
function startGoogleOAuth() {
  const authWindow = new BrowserWindow({
    width: 500,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID!;
  const redirectUri = "http://localhost"; // or your redirect URI

  // 🔒 Generate a secure nonce (random string)
  const nonce = crypto.randomUUID(); // Or use any random generator

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=id_token` + // 👈 ONLY id_token
    `&scope=openid%20email%20profile` +
    `&nonce=${nonce}`;

  authWindow.loadURL(authUrl);

  // Monitor for redirect to capture token
  authWindow.webContents.on("will-redirect", (event, url) => {
    if (url.startsWith(redirectUri)) {
      const matched = url.match(/id_token=([^&]*)/);
      if (matched) {
        const token = matched[1];
        mainWindow.webContents.send("google-token", token);
        authWindow.close();
      }
    }
  });
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  ipcMain.handle("start-google-oauth", () => {
    startGoogleOAuth();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
