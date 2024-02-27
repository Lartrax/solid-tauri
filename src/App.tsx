import { type Component } from "solid-js";

import styles from "./App.module.css"

const App: Component = () => {


  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "2em", width: "30vmax" }}>
      <p style={{ color: "#5ae", "margin-bottom": "2em" }}>Links to projects</p>
      <a class={styles.navigator} href="/word-distance">
        Word distance
      </a>
      <a class={styles.navigator}>
        Prime numbers
      </a>
      <a class={styles.navigator}>
        Placeholder
      </a>
    </div>
  );
};

export default App;
