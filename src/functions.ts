import { invoke } from "@tauri-apps/api";

export const logger = (log: any) => {
  invoke("log", { log: JSON.stringify(log) });
};
