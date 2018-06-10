/// <reference types="react" />
import * as React from "react";
export declare type ScopeSelector<TModel extends object, TScope> = (model: TModel) => TScope;
export declare type IScopeContext = <TModel extends object, TScope>(selector: (scope: TModel) => TScope) => ScopeSelector<TModel, TScope>;
export interface IScopeProps<TModel extends object, TScope extends object> {
    scope: ScopeSelector<TModel, TScope>;
}
export declare const Provider: React.ComponentType<React.ProviderProps<IScopeContext>>, Consumer: React.ComponentType<React.ConsumerProps<IScopeContext>>;
export interface IScope<TModel extends object, TScope extends object> extends Scope<TModel, TScope> {
    new (props: IScopeProps<TModel, TScope>): Scope<TModel, TScope>;
}
export declare class Scope<TModel extends object, TScope extends object> extends React.Component<IScopeProps<TModel, TScope>> {
    render(): JSX.Element;
}
