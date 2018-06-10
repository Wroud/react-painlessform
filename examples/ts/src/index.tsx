import * as React from "react";
import { render } from "react-dom";
import { MyForm } from "./MyForm";
import "./styles.css";

const App = () => (
  <div className="app">
    <h3>
      Calculated fields example with{" "}
      <a href="https://github.com/Wroud/react-painlessform">Painless Form</a>
    </h3>
    <p>Example shows how create simple form with calculated fields.</p>
    <MyForm />
  </div>
);

render(<App />, document.getElementById("root"));
