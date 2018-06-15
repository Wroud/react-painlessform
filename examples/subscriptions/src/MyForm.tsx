import * as React from "react";
import { createFormFactory } from "react-painlessform";
import { INumbers, MinMaxCalc } from "./MinMaxCalc";

export interface IMyForm {
  numbers: INumbers[];
}

const { Form, Subscribe } = createFormFactory<IMyForm>();

export class MyForm extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      numberId: 0,
      numbers: [0]
    };
  }
  render() {
    const { numbers } = this.state;
    return (
      <Form
        onSubmit={e => m => console.log(m)}
        initValues={{ numbers: [] }}
      >
        {numbers.map(uId => (
          <MinMaxCalc
            name={(f: IMyForm) => f.numbers[uId]}
            onRemove={this.removeUser(uId)}
            key={uId}
          />
        ))}
        <Subscribe to={{ formNumbers: f => f.numbers }}>
          {({ formNumbers }) => {
            if (!formNumbers || !Array.isArray(formNumbers)) {
              return false;
            }
            return <div>Form average: {formNumbers.reduce((s, n) => s + n.min + n.max, 0) / formNumbers.length / 2}</div>;
          }}
        </Subscribe>
        <br />
        <button type="button" onClick={this.addUser}>Add Numbers</button>
        <button type="submit">Submit</button>
      </Form>
    );
  }
  addUser = () => {
    this.setState(({ numberId, numbers }) => ({
      numberId: numberId + 1,
      numbers: [...numbers, numberId + 1]
    }));
  }
  removeUser = (id: number) => () => {
    this.setState(({ numbers }) => ({
      numbers: numbers.filter(nId => nId !== id)
    }));
  }
}

export interface IState {
  numberId: number;
  numbers: number[];
}
