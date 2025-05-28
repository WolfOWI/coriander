import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  startGoogleOAuth: () => ipcRenderer.invoke("start-google-oauth"),

  onGoogleToken: (callback: (token: string) => void) => {
    ipcRenderer.on("google-token", (_event, token) => {
      callback(token);
    });
  },
});
