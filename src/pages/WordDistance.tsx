import { For, createEffect, createSignal, on, type Component } from "solid-js";

import styles from "./WordDistance.module.css";
import Button from "../components/Button";

import { invoke } from "@tauri-apps/api/core";

const WordDistance: Component = () => {
  const [search, setSearch] = createSignal("");
  const [filteredFoods, setFilteredFoods] = createSignal<string[]>([]);
  const [isSearching, setIsSearching] = createSignal(false);
  const [searchText, setSearchText] = createSignal("Search...");

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
      <input
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
      <div class={styles.scrollBox}>
        <For each={filteredFoods()}>
          {(food) => (
            <Button
              text={food}
              style={{ border: "none" }}
              onClick={() => navigator.clipboard.writeText(food)}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default WordDistance;
