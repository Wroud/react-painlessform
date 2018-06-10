import * as React from "react";
import { isString } from "util";
import Yup from "yup";
import { createFormFactory, IFormStorage, IsField, IUpdateEvent } from "../../../src"; // "react-painlessform";
import { TextField } from "./FormPrimitives";

export interface IUser {
  firstName: string;
  lastName: string;
}

const { Field, Scope, Transform, Validation } = createFormFactory<IUser>();

function* transformer(event: IUpdateEvent<IUser>, is: IsField<IUser>, { values }: IFormStorage<IUser>): IterableIterator<IUpdateEvent<IUser>> {
  const { value } = event;
  if (is(f => f.lastName) && isString(value) && value.length > 0) {
    const upperValue = value.charAt(0).toUpperCase() + value.slice(1);
    yield {
      selector: f => f.lastName,
      value: upperValue
    };
    return;
  }
  if (is(f => f.firstName) && isString(value) && value.length > 0) {
    const upperValue = value.charAt(0).toUpperCase() + value.slice(1);
    yield {
      selector: f => f.firstName,
      value: upperValue
    };
    return;
  }
  yield event;
}

const validator = Yup.object<IUser>().shape({
  firstName: Yup.string()
    .min(2, "C'mon, your name is longer than that")
    .required("First name is required."),
  lastName: Yup.string()
    .min(2, "C'mon, your name is longer than that")
    .required("Last name is required.")
});

export const UserForm = ({ name, onRemove }: IProps) => (
  <Scope name={name}>
    <Validation validator={validator}>
      <Transform transformer={transformer}>
        <Field name={f => f.firstName} label="First Name" placeholder="Dan" children={TextField} />
        <Field name={f => f.lastName} label="Last Name" placeholder="Abramov" children={TextField} />
      </Transform>
    </Validation>
    <button type="button" onClick={onRemove}>Remove</button>
  </Scope>
);

export interface IProps {
  name: (model: any) => IUser;
  onRemove: () => any;
}
