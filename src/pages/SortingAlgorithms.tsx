import { createSignal, type Component } from "solid-js";

import styles from "./SortingAlgorithms.module.css";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import InputField from "../components/InputField";

import { invoke } from "@tauri-apps/api/core";

type Sorted = {
  duration: String;
  iterations: String;
  sorted: Number[];
};

enum SortType {
  Timsort = "timsort",
  Bogo = "bogo",
  FullBogo = "fullbogo",
  CountingBTree = "counting_btree",
}

const SortingAlgorithms: Component = () => {
  const [length, setLength] = createSignal<number | undefined>();
  const [span, setSpan] = createSignal<number | undefined>();
  const [sortType, setSortType] = createSignal<number | undefined>();
  const [response, setResponse] = createSignal<Sorted>();
  const [isLoading, setIsLoading] = createSignal(false);

  const sort = async () => {
    setResponse(undefined);
    setIsLoading(true);

    if (length() ?? 0) {
      setLength(0);
    }
    if (span() ?? 0) {
      setSpan(0);
    }

    setResponse(
      await invoke<Sorted>("sort", {
        sort_type: sortType,
        length: length(),
        span: span(),
      })
    );
    setIsLoading(false);
  };

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "1em" }}>
      <div style={{ display: "flex", gap: "1em" }}>
        <select class={styles.list} value="GET">
          <option value={SortType.Timsort}>Timsort</option>
          <option value={SortType.Bogo}>Bogo</option>
          <option value={SortType.FullBogo}>Full Bogo</option>
          <option value={SortType.CountingBTree}>Counting Binary Tree</option>
        </select>
        <InputField
          type="text"
          value={
            length()
              ?.toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? "" // Add space every 3 digits
          }
          min={10}
          max={1000000}
          onInput={(e) =>
            setLength(
              parseInt(e.target.value)
                ? parseInt(e.target.value.replace(/\D/g, "")) // Remove non-digits
                : undefined
            )
          }
          placeholder="Length"
        />
        <InputField
          type="text"
          value={
            span()
              ?.toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? "" // Add space every 3 digits
          }
          min={0}
          onInput={(e) =>
            setSpan(
              parseInt(e.target.value)
                ? parseInt(e.target.value.replace(/\D/g, "")) // Remove non-digits
                : undefined
            )
          }
          placeholder="Span"
        />
      </div>
      <Button text="Get primes" onClick={() => sort()} />
      <p>Time: {response()?.duration}</p>
      <div class={styles.scrollBox}>
        <span
          class={styles.loader}
          style={{ display: isLoading() ? "flex" : "none" }}
        >
          loading
        </span>
        {response()?.primes.toString()}
      </div>
    </div>
  );
};

export default SortingAlgorithms;
