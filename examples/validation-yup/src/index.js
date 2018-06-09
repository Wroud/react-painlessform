import "./styles.css";
import React from "react";
import { render } from "react-dom";
import { createFormFactory } from "react-painlessform";
import classnames from "classnames";
import Yup from "yup";

const { Field, Form, Validation, FormContex } = createFormFactory();

const TextField = ({ inputHook, rest: { label, placeholder } }) => (
  <div className={"input-group"}>
    <label className="label" htmlFor={inputHook.name}>{label}</label>
    <input className="text-input" placeholder={placeholder} id={inputHook.name} {...inputHook} />
  </div>
);
const CheckBox = ({ inputHook, rest: { label } }) => (
  <div className={"input-group"}>
    <input {...inputHook} id={inputHook.name} />
    <label htmlFor={inputHook.name}>{label}</label>
  </div>
);

const validationYup = Yup.object().shape({
  user: Yup.object().shape({
    firstName: Yup.string()
      .min(2, "C'mon, your name is longer than that")
      .required("First name is required."),
    lastName: Yup.string()
      .min(2, "C'mon, your name is longer than that")
      .required("Last name is required."),
  }),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required!"),
  agree: Yup.boolean()
});

class MyForm extends React.Component {
  render() {
    return (
      <Form onReset={this.handleReset} onSubmit={this.handleSubmit}>
        <Validation validator={validationYup}>
          <Field name={f => f.user.firstName} label={"First Name"} placeholder={"John"} children={TextField} />
          <Field name={f => f.user.lastName} label={"Last Name"} placeholder={"Doe"} children={TextField} />
          <Field name={f => f.email} type={"email"} label={"Email"} placeholder={"Enter your email"} children={TextField} />
          <Field name={f => f.agree} type={"checkbox"} label={"I agree with terms"} children={CheckBox} />
        </Validation>
        <button type="reset" className="outline">Reset</button>
        <button type="submit">Submit</button>
      </Form >
    );
  }
  handleReset = () => { };
  handleSubmit = event => model => console.log(model);
}

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
