# react-painlessform
> Uses React 16.3 [Context](https://reactjs.org/docs/context.html)

Painless Form is a bunch of React Components that helps you:
* Validate form via custom validator or [Yup.Schema](https://github.com/jquense/yup)
  or combined validator!
* Calculate fields
* Use typescript for type checking in fields!
* Create reusable form parts with own Validation & Transform

without any configs only declarative style.

[![Travis](https://img.shields.io/travis/Wroud/react-painlessform.svg)](https://travis-ci.org/Wroud/react-painlessform)
[![codecov](https://codecov.io/gh/Wroud/react-painlessform/branch/master/graph/badge.svg)](https://codecov.io/gh/Wroud/react-painlessform)
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

* [Usage](https://codesandbox.io/s/github/Wroud/react-painlessform/tree/master/examples/base)
* [Styling](https://codesandbox.io/s/github/Wroud/react-painlessform/tree/master/examples/styling-example)
* [Yup validation](https://codesandbox.io/s/github/Wroud/react-painlessform/tree/master/examples/validation-yup)
* [Transformations](https://codesandbox.io/s/github/Wroud/react-painlessform/tree/master/examples/transformations)
* [Building reusable parts](https://codesandbox.io/s/github/Wroud/react-painlessform/tree/master/examples/ts)
* [Model bilding](https://codesandbox.io/s/github/Wroud/react-painlessform/tree/master/examples/model)
* [Date range picker & selector with data from api](https://codesandbox.io/s/73nwk5ljxx)

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
                <Field name={f=>f.field}>
                    {({ inputHook, rest }) => <input {...inputHook, ...rest} />}
                </Field>
                <Field name={f=>f.field2}>
                    {({ inputHook, rest }) => <input {...inputHook, ...rest} />}
                </field>
                <button type="submit">Submit</button>
            </div>
        </Form>
    );
}
```
