/// <reference types="react" />
import * as React from "react";
import { Path } from "../Path";
export declare type ScopeSelector<TModel extends object, TScope> = (model: TModel) => TScope;
export interface IScopeProps<TModel extends object, TScope extends object> {
    name: ScopeSelector<TModel, TScope>;
}
export declare const Provider: React.ComponentType<React.ProviderProps<Path<any, any>>>, Consumer: React.ComponentType<React.ConsumerProps<Path<any, any>>>;
export interface IScope<TModel extends object, TScope extends object> extends Scope<TModel, TScope> {
    new (props: IScopeProps<TModel, TScope>): Scope<TModel, TScope>;
}
export declare class Scope<TModel extends object, TScope extends object> extends React.Component<IScopeProps<TModel, TScope>> {
    render(): JSX.Element;
}
