
import { createSignal } from "solid-js";

import styles from "./Header.module.css";
import icon from "../../assets/icon.ico";

import { appWindow } from "@tauri-apps/api/window";


export const Header = () => {
    const [isMaximized, setIsMaximized] = createSignal(false);

    const dragWindow = async () => {
        await appWindow.startDragging();
    };
    const maximizeWindow = async () => {
        if (await appWindow.isMaximized()) {
            setIsMaximized(false);
            await appWindow.unmaximize();
        } else {
            setIsMaximized(true);
            await appWindow.maximize();
        }

    };
    const minimizeWindow = async () => {
        await appWindow.minimize();
    };
    const closeWindow = async () => {
        await appWindow.close();
    };

    return (
        <header class={styles.header}>
            <div onPointerDown={dragWindow} style={{ display: "flex", "flex-grow": 1, "align-items": "center" }}>
                <img src={icon} style={{ height: "26px", "margin-left": "4px" }} />
            </div>
            <div class={styles.button} onClick={minimizeWindow} style={{ "font-size": "12px" }}>
                —
            </div>
            <div class={styles.button} onClick={maximizeWindow} style={{ "font-size": "20px" }}>
                {isMaximized() ? "◱" : "◻"}
            </div>
            <div class={styles.buttonX} onClick={closeWindow} style={{ "font-size": "16px" }}>
                ✕
            </div>
        </header>
    )
}