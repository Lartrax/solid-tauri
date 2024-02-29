import { For, createEffect, createSignal, on, type Component } from "solid-js";

import styles from "./WordDistance.module.css";
import Button from "../components/Button";
import InputField from "../components/InputField";

import { invoke } from "@tauri-apps/api/core";
import { logger } from "../functions";

const WordDistance: Component = () => {
  const [search, setSearch] = createSignal("charee");
  const [filteredFoods, setFilteredFoods] = createSignal<string[]>([]);
  const [isSearching, setIsSearching] = createSignal(false);
  const [searchText, setSearchText] = createSignal("Search...");
  const [selectedFood, setSelectedFood] = createSignal("cherry");

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

  const loader = ["..⋅", ".⋅·", "⋅·⋅", "·⋅.", "⋅..", "..."];

  createEffect(async () => {
    logger(
      "________|||  " +
        Math.min(Math.max(search().length - 2, 2), 5) +
        "  |||________"
    );
    const filteredFoods = await Promise.all(
      foods.map(async (food) => {
        const distance = await invoke<number>("word_distance", {
          first: search().toLowerCase(),
          second: food,
        });
        logger(food + " " + JSON.stringify(distance));
        if (distance < Math.min(Math.max(search().length - 2, 2), 5)) {
          return { food, distance };
        }
      })
    );
    setFilteredFoods(foods.filter((_, index) => filteredFoods[index]?.food));
  });

  createEffect(
    on(isSearching, () => {
      let index = 0;
      const interval = setInterval(() => {
        setSearchText(
          "Search" +
            // " ".repeat(index / (loader.length - 1)) +
            loader[index % loader.length]
        );

        index += 1;

        if (!isSearching()) {
          clearInterval(interval);
          setSearchText("Search...");
        }
      }, 200);
    })
  );

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "1em" }}>
      <InputField
        type="search"
        class={styles.search}
        value={search()}
        onInput={(e) => setSearch(e.target.value)}
        onFocusIn={() => setIsSearching(true)}
        onFocusOut={() => setIsSearching(false)}
        onMouseDown={async (e) =>
          e.button === 2 && setSearch(await navigator.clipboard.readText())
        }
        placeholder={searchText()}
      />
      <div
        class={styles.scrollBox}
        style={selectedFood() && { "min-height": "1em" }}
      >
        {selectedFood() ? (
          <Button
            text={selectedFood()}
            style={{ border: "none" }}
            onClick={() => setSelectedFood("")}
          />
        ) : (
          <For each={filteredFoods()}>
            {(food) => (
              <Button
                text={food}
                style={{ border: "none" }}
                onClick={() => setSelectedFood(food)}
              />
            )}
          </For>
        )}
      </div>
      {selectedFood() && (
        <div
          style={{
            background: "#fafafa",
            border: "1px solid #eee",
            padding: "1em",
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
          }}
        >
          <p>Breakdown</p>
          <br />
          <div style={{ "text-align": "left" }}>
            <span style={{ display: "flex", gap: "1em" }}>
              <For each={search().split("")}>
                {(char) => <p style={{ width: "1em" }}>{char}</p>}
              </For>
            </span>
            <span style={{ display: "flex", gap: "1em" }}>
              <For each={"↓↓ ↓↓ ".split("")}>
                {(char) => <p style={{ width: "1em" }}>{char}</p>}
              </For>
            </span>
            <span style={{ display: "flex", gap: "1em" }}>
              <For each={"↓↓ ↙  ".split("")}>
                {(char) => <p style={{ width: "1em" }}>{char}</p>}
              </For>
            </span>
            <span style={{ display: "flex", gap: "1em" }}>
              <For each={"↓↓↓↓↶↶".split("")}>
                {(char) => <p style={{ width: "1em" }}>{char}</p>}
              </For>
            </span>
            <span style={{ display: "flex", gap: "1em" }}>
              <For each={selectedFood().split("")}>
                {(char) => <p style={{ width: "1em" }}>{char}</p>}
              </For>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordDistance;

// charset ↓←→↞↠↶-↙↘
