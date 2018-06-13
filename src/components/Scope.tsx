import * as React from "react";
import { Path } from "../Path";

export type ScopeSelector<TModel extends object, TScope> = (model: TModel) => TScope;
export interface IScopeProps<TModel extends object, TScope extends object> {
    name: ScopeSelector<TModel, TScope>;
}

export const { Provider, Consumer } = React.createContext(Path.root<any>());

export interface IScope<TModel extends object, TScope extends object> extends Scope<TModel, TScope> {
    new(props: IScopeProps<TModel, TScope>): Scope<TModel, TScope>;
}

export class Scope<TModel extends object, TScope extends object> extends React.Component<IScopeProps<TModel, TScope>> {
    render() {
        return (
            <Consumer>
                {scope => <Provider value={scope.join(Path.fromSelector(this.props.name))}>{this.props.children}</Provider>}
            </Consumer>
        );
    }
}
