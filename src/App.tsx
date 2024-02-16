import {
  For,
  createEffect,
  createMemo,
  createSignal,
  type Component,
} from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";

import { invoke } from "@tauri-apps/api";

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
  ];

  const getFilteredFoods = async () => {
    const filteredFoods = await Promise.all(
      foods.map(async (food) => {
        const distance = await invoke<number>("levenshtein_distance", {
          first: search(),
          second: food,
        });
        if (distance < 1) {
          return food;
        }
      })
    );
    return foods.filter((_, index) => filteredFoods[index]);
  };

  createEffect(async () => {
    const filteredFoods = await getFilteredFoods();
    setFilteredFoods(filteredFoods);
  });

  invoke<string>("save").then((res) => setSaveText(res));

  const logger = (log: any) => {
    invoke("log", { log: JSON.stringify(log) });
  };

  return (
    <div class={styles.App}>
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
            style={{ "padding-left": "4px" }}
            onInput={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <For each={filteredFoods()}>{(food) => <span>{food}</span>}</For>
        </div>
      </header>
    </div>
  );
};

export default App;
