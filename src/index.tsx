/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import "./index.css";
import Home from "./Home";
import WordDistance from "./pages/WordDistance";
import Navbar from "./components/Navbar";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

const App = (props: any) => {
  return (
    <div>
      <Navbar />
      {props.children}
    </div>
  );
};

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />
      <Route path="/word-distance" component={WordDistance} />
    </Router>
  ),
  root!
);
