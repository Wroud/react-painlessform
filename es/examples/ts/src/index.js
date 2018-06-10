"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
const Hello_1 = require("./Hello");
const styles = {
    fontFamily: "sans-serif",
    textAlign: "center"
};
const App = () => (React.createElement("div", { style: styles },
    React.createElement(Hello_1.default, { name: "CodeSandbox" }),
    React.createElement("h2", null,
        "Start editing to see some magic happen ",
        "\u2728")));
react_dom_1.render(React.createElement(App, null), document.getElementById("root"));
