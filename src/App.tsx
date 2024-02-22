import { For, createEffect, createSignal, type Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";

import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

const App: Component = () => {
  const [saveText, setSaveText] = createSignal("");
  const [search, setSearch] = createSignal("");
  const [filteredFoods, setFilteredFoods] = createSignal<string[]>([]);

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

  return (
    <div class={styles.App}>
      <div
        style={{
          "z-index": 1,
          height: "32px",
          width: "100%",
          position: "fixed",
          top: 0,
          "background-color": "rgba(255, 255, 255, 0%)",
          display: "flex",
          "justify-content": "flex-end",
        }}
        onPointerDown={dragWindow}
      >
        <div class={styles.button} style={{ "font-size": "0.7em" }}>
          —
        </div>
        <div class={styles.button} style={{ "font-size": "1.1em" }}>
          ◻
        </div>
        <div class={styles.buttonX} style={{ "font-size": "1em" }}>
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
