import "./styles.css";
import React from "react";
import { render } from "react-dom";
import { createFormFactory } from "react-painlessform";
import classnames from "classnames";

const { Field, Form, FormContex, Transform } = createFormFactory();

function* transformer(event, is, { values }) {
  if (is(f => f.min) && event.value > values.max) {
    yield {
      selector: f.max,
      value: event.value,
      state: {}
    }
  }
  if (is(f => f.max) && event.value < values.min) {
    yield {
      selector: f => f.min,
      value: event.value,
      state: {}
    }
  }
  yield event;
}

class MyForm extends React.Component {
  render() {
    return (
      <Form onReset={this.handleReset} onSubmit={this.handleSubmit}>
        <Transform transformer={}>
          <Field name={f => f.min} label={"Minimum Value"} placeholder={"0"} children={TextField} />
          <Field name={f => f.max} label={"Maximum Value"} placeholder={"0"} children={TextField} />
        </Transform>
        <button type="reset" className="outline">Reset</button>
        <button type="submit">Submit</button>
      </Form >
    );
  }
  handleReset = () => { };
  handleSubmit = event => model => console.log(model);
}

const TextField = ({ inputHook, rest: { label, placeholder } }) => (
  <div className={"input-group"}>
    <label className="label" htmlFor={inputHook.name}>{label}</label>
    <input className="text-input" placeholder={placeholder} id={inputHook.name} {...inputHook} />
  </div>
);

const App = () => (
  <div className="app">
    <h3>
      Building input primitives with{" "}
      <a href="https://github.com/Wroud/react-painlessform">Painless Form</a>
    </h3>
    <p>Example shows how create simple form with own styling components.</p>
    <MyForm />
  </div>
);

render(<App />, document.getElementById("root"));
