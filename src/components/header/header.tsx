import { createSignal } from "solid-js";

import styles from "./Header.module.css";

import { appWindow } from "@tauri-apps/api/window";

export const Header = () => {
  const [isMaximized, setIsMaximized] = createSignal(false);

  const maximizeWindow = async () => {
    await appWindow.toggleMaximize();
    setIsMaximized(await appWindow.isMaximized());
  };
  const minimizeWindow = async () => {
    await appWindow.minimize();
  };
  const closeWindow = async () => {
    await appWindow.close();
  };

  return (
    <header class={styles.header}>
      <div
        data-tauri-drag-region
        style={{
          display: "flex",
          "flex-grow": 1,
          "align-items": "center",
        }}
      >
        <div class={styles.menuItem}>≣</div>
      </div>
      <div
        class={styles.button}
        onClick={minimizeWindow}
        style={{ "font-size": "12px" }}
      >
        —
      </div>
      <div
        class={styles.button}
        onClick={maximizeWindow}
        style={{ "font-size": "20px" }}
      >
        {isMaximized() ? "◱" : "◻"}
      </div>
      <div
        class={styles.buttonX}
        onClick={closeWindow}
        style={{ "font-size": "16px" }}
      >
        ✕
      </div>
    </header>
  );
};
