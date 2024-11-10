import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  copyToClipboard: async () =>
    await ipcRenderer.invoke("copy-image-to-clipboard"),

  safeFetch: async (url: string) => await ipcRenderer.invoke("safe-fetch", url),
});

contextBridge.exposeInMainWorld("env", {
  TENOR_API_KEY: process.env.TENOR_API_KEY,
  TENOR_CLIENT_KEY: process.env.TENOR_CLIENT_KEY,
});

console.log("hello from preload");
