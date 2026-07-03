import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  copyToClipboard: async () =>
    await ipcRenderer.invoke("copy-image-to-clipboard"),

  safeFetch: async (url: string) => await ipcRenderer.invoke("safe-fetch", url),

  getAppVersion: async (): Promise<string> =>
    await ipcRenderer.invoke("get-app-version"),

  getRequiredVersion: async (): Promise<string> =>
    await ipcRenderer.invoke("get-required-version"),
});

contextBridge.exposeInMainWorld("env", {
  TENOR_API_KEY: process.env.TENOR_API_KEY,
  TENOR_CLIENT_KEY: process.env.TENOR_CLIENT_KEY,
  KLIPY_API_KEY: process.env.KLIPY_API_KEY,
});

console.log("hello from preload");
