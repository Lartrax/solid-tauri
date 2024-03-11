import { type Component } from "solid-js";

import styles from "./ApiGui.module.css";
import InputField from "../components/InputField";

const ApiGui: Component = () => {
  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "1em" }}>
      <div style={{ display: "flex", gap: "1em" }}>
        <select class={styles.list}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <InputField type="text" placeholder="api.endpoint.com/parameter" />
      </div>
    </div>
  );
};

export default ApiGui;
