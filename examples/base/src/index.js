import "./styles.css";
import React from "react";
import { render } from "react-dom";
import {
  createRawFormValidator,
  createFormValidator,
  createFormFactory
} from "react-painlessform";
import Yup from "yup";
import classnames from "classnames";

const { Field, Form, Validation, FormContext, Transform } = createFormFactory();

const submitValidator = createRawFormValidator((values, meta) => {
  const errors = [];
  if (!meta.props || !meta.props) {
    return errors;
  }
  const { stateErrors } = meta.props;
  Object.keys(values).forEach(name => {
    const error = stateErrors[name];
    if (error) {
      const message = {
        message: error.message,
        meta: { type: "server" }
      };
      errors.push({
        selector: f => f[name],
        errors: [message]
      });
    }
  });
  return errors;
});

const validationYup = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "C'mon, your name is longer than that")
    .required("First name is required."),
  lastName: Yup.string()
    .min(2, "C'mon, your name is longer than that")
    .required("Last name is required."),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required!")
});
export const validation = createFormValidator(submitValidator, validationYup);

const InputFeedback = ({ errors, hidden }) => {
  if (errors.length === 0 || hidden) {
    return null;
  }
  return (
    <div className="input-feedback">
      {errors.map((error, key) => (
        <span key={key}>
          {error.message}
          <br />
        </span>
      ))}
    </div>
  );
};

const Label = ({ className, children, ...props }) => (
  <label className="label" {...props}>
    {children}
  </label>
);

const TextInput = ({ label, name, type, placeholder }) => {
  return (
    <Field name={name} subscribe={({ isSubmitting }) => ({ isSubmitting })}>
      {({
        value,
        isVisited,
        isChanged,
        isValid,
        validationErrors,
        inputHook,
        rest
      }) => {
        let serverError = false;
        const errors = validationErrors.filter(error => {
          const se = error.meta && error.meta.type === "server" && !isChanged;
          if (se) {
            serverError = true;
          }
          return !error.meta || se;
        });
        const isErrorVisible = serverError || (errors.length !== 0 && isVisited);
        const classes = classnames("input-group", {
          "animated shake error": isErrorVisible
        });
        return (
          <div className={classes}>
            <Label htmlFor={name}>{label}</Label>
            <input
              {...inputHook}
              className="text-input"
              placeholder={placeholder}
              disabled={rest.isSubmitting}
            />
            <InputFeedback errors={errors} hidden={!isErrorVisible} />
          </div>
        );
      }}
    </Field>
  );
};
function* transformer({ value }, is, { values }) {
  if (is(f => f.min)) {
    if (parseInt(value) > parseInt(values.max)) {
      yield {
        selector: f => f.max,
        value,
        state: {}
      };
    }
  }
  if (is(f => f.max)) {
    if (parseInt(value) < parseInt(values.min)) {
      yield {
        selector: f => f.min,
        value,
        state: {}
      };
    }
  }
  if (is(f => f.lastName)) {
    const value = value.charAt(0).toUpperCase() + value.slice(1);
    yield {
      selector: f => f.lastName,
      value,
      state: {}
    };
  }
  if (is(f => f.firstName)) {
    const value = value.charAt(0).toUpperCase() + value.slice(1);
    yield {
      selector: f => f.firstName,
      value,
      state: {}
    };
  }
  return {};
}

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitErrors: {},
      submitting: false
    };
  }
  handleReset = () => {
    this.setState({
      submitting: false,
      submitErrors: {}
    });
  };
  handleSubmit = () => model => {
    console.log(model);
    this.setState({
      submitting: true,
      submitErrors: {}
    });
    setTimeout(() => {
      this.setState({
        submitting: false,
        submitErrors: {
          firstName: {
            message: ["Error from server"]
          },
          lastName: {
            message: ["Another error from server"]
          }
        }
      });
    }, 1000);
  };
  render() {
    return (
      <Form
        onReset={this.handleReset}
        onSubmit={this.handleSubmit}
        isSubmitting={this.state.submitting}
        initValues={{
          firstName: "",
          min: 0,
          max: 0
        }}
      >
        <FormContext>
          {({ isSubmitting }) => (
            <Validation
              validator={validation}
              stateErrors={() => this.state.submitErrors}
            >
              <TextInput
                name={f => f.firstName}
                label="First Name"
                placeholder="John"
              />
              <TextInput
                name={f => f.lastName}
                label="Last Name"
                placeholder="Doe"
              />
              <Transform transformer={this.transformer}>
                <TextInput
                  name={f => f.min}
                  type="number"
                  label="Min expected salary"
                  placeholder="Minimum"
                />
                <TextInput
                  name={f => f.max}
                  type="number"
                  label="Max expected salary"
                  placeholder="Maximum"
                />
              </Transform>
              <TextInput
                name={f => f.email}
                type="email"
                label="Email"
                placeholder="Enter your email"
              />
              <button
                type="reset"
                className="outline"
                disabled={isSubmitting}
              >
                Reset
              </button>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Validation>
          )}
        </FormContext>
      </Form>
    );
  }
}

const App = () => (
  <div className="app">
    <h3>
      Building input primitives with{" "}
      <a href="https://github.com/Wroud/react-painlessform">Painless Form</a>
    </h3>
    <p>
      Example shows how create simple form with Yup & backend validation and min
      & max fields.
    </p>
    <MyForm />
  </div>
);

render(<App />, document.getElementById("root"));
