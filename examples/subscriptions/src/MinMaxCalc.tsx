import * as React from "react";
import { createFormFactory, FieldValue, IFormStorage, IsField, IUpdateEvent, Path } from "react-painlessform"; // "../../../src";
import { TextField } from "./FormPrimitives";

export interface INumbers {
  min: number;
  max: number;
}

const { Field, Scope, Transform, Subscribe } = createFormFactory<INumbers>();

function* transformer(event: IUpdateEvent<INumbers, FieldValue>, is: IsField<INumbers>, { values }: IFormStorage<INumbers>): IterableIterator<IUpdateEvent<INumbers, FieldValue>> {
  const { value } = event;
  if (!value) {
    yield event;
    return;
  }
  if (is(f => f.min) && value > values.max) {
    yield {
      selector: Path.fromSelector(f => f.max),
      value
    };
  }
  if (is(f => f.max) && value < values.min) {
    yield {
      selector: Path.fromSelector(f => f.min),
      value
    };
  }
  yield event;
}

export const MinMaxCalc = ({ name, onRemove }: IProps) => (
  <Scope name={name}>
    <Transform transformer={transformer}>
      <Field name={f => f.min} label="Minimum" placeholder="0" defaultValue={0} children={TextField} />
      <Field name={f => f.max} label="Maximum" placeholder="0" defaultValue={0} children={TextField} />
    </Transform>
    <Subscribe to={{ min: f => f.min, max: f => f.max }}>
      {({ min, max }) => <div>Average: {(min + max) / 2}</div>}
    </Subscribe>
    <button type="button" onClick={onRemove}>Remove</button>
  </Scope>
);

export interface IProps {
  name: (model: any) => INumbers;
  onRemove: () => any;
}
