import { For, createEffect, createSignal, type Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { logger } from "./functions";
import icon from "./assets/icon.ico";

import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";


const App: Component = () => {
  const [saveText, setSaveText] = createSignal("");
  const [search, setSearch] = createSignal("");
  const [filteredFoods, setFilteredFoods] = createSignal<string[]>([]);
  const [isMaximized, setIsMaximized] = createSignal(false);

  const foods = [
    "apple",
    "banana",
    "cherry",
    "date",
    "elderberry",
    "fig",
    "grape",
    "honeydew",
    "kiwi",
    "lemon",
    "mango",
    "nectarine",
    "orange",
    "pear",
    "quince",
    "raspberry",
    "strawberry",
    "tangerine",
    "ugli",
    "watermelon",
    "xigua",
    "yuzu",
    "zucchini",
  ];

  const getFilteredFoods = async () => {
    const filteredFoods = await Promise.all(
      foods.map(async (food) => {
        const distance = await invoke<number>("word_distance", {
          first: search(),
          second: food,
        });
        if (distance < Math.min(Math.max(search().length - 2, 2), 5)) {
          return { food, distance };
        }
      })
    );
    return foods.filter((_, index) => filteredFoods[index]?.food);
  };

  createEffect(async () => {
    const filteredFoods = await getFilteredFoods();
    setFilteredFoods(filteredFoods);
  });

  invoke<string>("save").then((res) => setSaveText(res));

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
    <div class={styles.App}>
      <div
        style={{
          "z-index": 1,
          height: "32px",
          width: "100%",
          position: "fixed",
          top: 0,
          "background-color": "rgba(255, 255, 255, 20%)",
          display: "flex"
        }}
      >
        <div onPointerDown={dragWindow} style={{ display: "flex", "flex-grow": 1, "align-items": "center" }}>
          <img src={icon} style={{ height: "26px", "margin-left": "4px" }} />
        </div>
        <div class={styles.button} onClick={minimizeWindow} style={{ "font-size": "0.7em" }}>
          —
        </div>
        <div class={styles.button} onClick={maximizeWindow} style={{ "font-size": "1.1em" }}>
          {isMaximized() ? "◱" : "◻"}
        </div>
        <div class={styles.buttonX} onClick={closeWindow} style={{ "font-size": "1em" }}>
          ✕
        </div>
      </div>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to {saveText()}.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            "margin-top": "1em",
          }}
        >
          <input
            style={{
              "padding-left": "4px",
              width: "50%",
              "align-self": "center",
            }}
            onInput={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <div
            style={{
              display: "flex",
              "column-gap": "1em",
              "flex-wrap": "wrap",
              "align-self": "center",
              width: "50%",
            }}
          >
            <For each={filteredFoods()}>{(food) => <span>{food}</span>}</For>
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
