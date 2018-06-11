import * as React from "react";
import { createFormFactory } from "react-painlessform";
import { IUser, UserForm } from "./UserForm";

export interface IMyForm {
  users: IUser[];
}

const { Form } = createFormFactory<IMyForm>();

export class MyForm extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      userId: 0,
      users: [0]
    };
  }
  render() {
    const { users } = this.state;
    return (
      <Form onSubmit={e => m => console.log(m)}>
        {users.map(uId => (
          <UserForm
            name={(f: IMyForm) => f.users[uId]}
            onRemove={this.removeUser(uId)}
            key={uId}
          />)
        )}
        <br />
        <button type="button" onClick={this.addUser}>Add User</button>
        <button type="submit">Submit</button>
      </Form>
    );
  }
  addUser = () => {
    this.setState(({ userId, users }) => ({
      userId: userId + 1,
      users: [...users, userId + 1]
    }));
  }
  removeUser = (id: number) => () => {
    this.setState(({ users }) => ({
      users: users.filter(uId => uId !== id)
    }));
  }
}

export interface IState {
  userId: number;
  users: number[];
}
