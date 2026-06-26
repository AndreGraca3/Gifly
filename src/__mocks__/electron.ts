// Minimal electron stub so ts-jest can resolve the module in unit tests
export const app = {};
export const ipcMain = { handle: jest.fn() };
export const BrowserWindow = jest.fn();
