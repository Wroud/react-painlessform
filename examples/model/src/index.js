import "./styles.css";
import React from "react";
import { render } from "react-dom";
import { createFormFactory } from "react-painlessform";
import classnames from "classnames";

const { Field, Form, FormContex } = createFormFactory();

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.id = 0;
    this.emails = [0];
  }
  render() {
    return (
      <Form onReset={this.handleReset} onSubmit={this.handleSubmit}>
        <Field name={f => f.user.firstName} label={"First Name"} placeholder={"John"} children={TextField} />
        <Field name={f => f.user.lastName} label={"Last Name"} placeholder={"Doe"} children={TextField} />
        <Field name={f => f.user.gender} label={"Gender"} placeholder={"Select gender"} options={gender} children={SelectField} />
        <Field name={f => f.user.langs} label={"Favorite languages"} placeholder={"Select languages"} options={langs} children={SelectField} />
        <MultipleCheckbox name={f => f.user.wants} label={"I want"} values={want} />
        <Field name={f => f.stars} type={"radio"} label={"Good"} value={3} children={RadioField} />
        <Field name={f => f.stars} type={"radio"} label={"Normal"} value={1} children={RadioField} />
        <Field name={f => f.stars} type={"radio"} label={"bad"} value={0} children={RadioField} />
        {this.emails.map(id => (
          <Field name={f => f.email[id]} type={"email"} label={"Email"} placeholder={"Enter your email"} key={id} onChange={this.removeEmail(id)} children={TextField} />
        ))}
        <button type="button" className="outline" onClick={this.addEmail}>Add Email</button>
        <Field name={f => f.agree} type={"checkbox"} label={"I agree with terms"} children={Checkbox} />
        <button type="reset" className="outline">Reset</button>
        <button type="submit">Submit</button>
      </Form >
    );
  }
  addEmail = () => {
    this.emails.push(this.id++);
    this.forceUpdate();
  };
  removeEmail = (id) => (value) => {
    if(value === "") {
      this.emails.splice(this.emails.indexOf(id), 1);
    }
  };
  handleReset = () => { };
  handleSubmit = event => model => console.log(model);
}

const TextField = ({ inputHook, rest: { label, placeholder } }) => (
  <div className={"input-group"}>
    <label className="label" htmlFor={inputHook.name}>{label}</label>
    <input className="text-input" placeholder={placeholder} id={inputHook.name} {...inputHook} />
  </div>
);
const SelectField = ({ inputHook, rest: { label, placeholder, options } }) => (
  <div className={"input-group"}>
    <label className="label" htmlFor={inputHook.name}>{label}</label>
    <select className="text-input" placeholder={placeholder} id={inputHook.name} {...inputHook} >
      {options.map(({ value, label }) => <option value={value} key={value} disabled={value === undefined}>{label}</option>)}
    </select>
  </div>
);
const Checkbox = ({ inputHook, rest: { label } }) => (
  <div className={"input-group"}>
    <input {...inputHook} id={inputHook.name} />
    <label htmlFor={inputHook.name}>{label}</label>
  </div>
);
const RadioField = ({ inputHook, rest: { label } }) => (
  <div className={"input-group"}>
    <input {...inputHook} id={inputHook.name} />
    <label htmlFor={inputHook.name}>{label}</label>
  </div>
);
const MultipleCheckbox = ({ name, label, values }) => (
  <div className={"input-group"}>
    <label className="label">{label}</label>
    {values.map(v => (
      <Field name={name} type={"checkbox"} value={v} multiple={true} key={v} >
        {({ inputHook }) => [
          <input {...inputHook} id={inputHook.name} />,
          <label htmlFor={inputHook.name}>{v}</label>
        ]}
      </Field>
    ))}
  </div>);
const gender = [
  {
    value: undefined,
    text: "Select gender"
  },
  {
    value: 1,
    text: "Male"
  },
  {
    value: 2,
    text: "Female"
  },
  {
    value: 3,
    text: "Transgen"
  }
];
const langs = [
  {
    value: "C#",
    text: "C#"
  },
  {
    value: "JS",
    text: "JavaScript"
  },
  {
    value: "C++",
    text: "C++"
  },
  {
    value: "go",
    text: "Go"
  }
];
const want = ["Sleep", "Eat", "Coffe"];
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