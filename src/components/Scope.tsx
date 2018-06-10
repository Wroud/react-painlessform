import * as React from "react";

export type ScopeSelector<TModel extends object, TScope> = (model: TModel) => TScope;
export type IScopeContext = <TModel extends object, TScope>(selector: (scope: TModel) => TScope) => ScopeSelector<TModel, TScope>;
export interface IScopeProps<TModel extends object, TScope extends object> {
    scope: ScopeSelector<TModel, TScope>;
}

export const { Provider, Consumer } = React.createContext<IScopeContext>(s => s);

export interface IScope<TModel extends object, TScope extends object> extends Scope<TModel, TScope> {
    new(props: IScopeProps<TModel, TScope>): Scope<TModel, TScope>;
}

export class Scope<TModel extends object, TScope extends object> extends React.Component<IScopeProps<TModel, TScope>> {
    render() {
        return (
            <Consumer>
                {scope => <Provider value={s => f => s(scope(this.props.scope)(f as any) as any)}>{this.props.children}</Provider>}
            </Consumer>
        );
    }
}
