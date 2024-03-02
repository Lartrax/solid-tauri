import { type Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

import styles from "./Home.module.css";
import Button from "./components/Button";

const Home: Component = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "2em",
        width: "30vmax",
      }}
    >
      <p class={styles.title}>Links to projects</p>
      <Button text="Word distance" onClick={() => navigate("/word-distance")} />
      <Button text="Prime numbers" onClick={() => navigate("/prime-numbers")} />
      <Button text="Placeholder" onClick={() => navigate("/placeholder")} />
    </div>
  );
};

export default Home;
