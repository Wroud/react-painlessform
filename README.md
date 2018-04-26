# react-painlessform
> Uses React 16.3 [Context](https://reactjs.org/docs/context.html)

Painless Form is a bunch of React Components that helps you:
* Validate form via custom validator or [Yup.Schema](https://github.com/jquense/yup)
  or combined validator!
* Calculate fields
* Use typescript for type checking in fields!

without any configs only declarative style.

[![Travis](https://img.shields.io/travis/Wroud/react-painlessform.svg)](https://travis-ci.org/Wroud/react-painlessform)
[![Coverage Status](https://coveralls.io/repos/github/Wroud/react-painlessform/badge.svg?branch=master)](https://coveralls.io/github/Wroud/react-painlessform?branch=master)
[![GitHub issues](https://img.shields.io/github/issues/Wroud/react-painlessform.svg)](https://github.com/Wroud/react-painlessform/issues)
[![GitHub license](https://img.shields.io/github/license/Wroud/react-painlessform.svg)](https://github.com/Wroud/react-painlessform/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-painlessform.svg?style=flat-square)](https://www.npmjs.com/package/react-painlessform)
[![npm downloads](https://img.shields.io/npm/dm/react-painlessform.svg?style=flat-square)](https://www.npmjs.com/package/react-painlessform)

## Install
```
npm install --save react-painlessform
```

## Documentation

* [API Reference TypeScript](https://wroud.github.io/react-painlessform/)

## Examples

* [Usage example](https://codesandbox.io/s/1yl74031w3)

```js
import { createFormFactory } from "react-painlessform";

interface IModel {
    field: number;
    field2: string;
}

const { Form, Field } = createFormFactory<IModel>();

const MyForm = (props) => {
    return (
        <Form initValues={values} onModelChange={onModelChange}>
            <div>
                <Field name={"field"}>
                    {({ value, onClick, onChange, rest }) => (
                        <input name={name} value={value} onClick={onClick} onChange={onChange} {...rest} />
                    )}
                </Field>
                <Field name={"field2"}>
                    {({ value, onClick, onChange, rest }) => (
                        <input name={name} value={value} onClick={onClick} onChange={onChange} {...rest} />
                    )}
                </field>
                <button type={"submit"}>Submit</button>
            </div>
        </Form>
    );
}
```