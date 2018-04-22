/// <reference types="react" />
import * as React from "react";
import { IErrorMessage } from "../FormValidator";
import { IFieldState } from "../interfaces/field";
import { IFormState } from "./Form";
export interface IFieldClass<N extends keyof T, V extends T[N], T> extends FieldClass<N, V, T> {
    new (props: IFieldProps<N, V, T>): FieldClass<N, V, T>;
}
export interface IFieldProps<N extends keyof T, V extends T[N], T> {
    value: V;
    formState: IFormState<T>;
    validationErrors: Array<IErrorMessage<any>>;
    validationScope: Array<IErrorMessage<any>>;
    isVisited: boolean;
    isChanged: boolean;
    isValid: boolean;
    name: N;
    children?: ((state: IFieldProps<N, V, T>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<V>) => any;
}
export declare const Provider: React.ComponentClass<{
    value: {};
}>, Consumer: React.ComponentClass<{
    children?: (context: {}) => React.ReactNode;
}>;
export declare class FieldClass<N extends keyof T, V extends T[N], T> extends React.Component<IFieldProps<N, V, T>> {
    private inputValue;
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(prevProps: IFieldProps<N, V, T>): void;
    shouldComponentUpdate(nextProps: IFieldProps<N, V, T>): boolean;
    private setVisited();
    private onClick;
    private handleChange;
    private update;
}
export declare function withFormState(Component: any): <N extends keyof T, V extends T[N], T>(props: Pick<IFieldProps<N, V, T>, "children" | "name" | "onChange" | "onClick">) => JSX.Element;
export declare const Field: <N extends keyof T, V extends T[N], T>(props: Pick<IFieldProps<N, V, T>, "children" | "name" | "onChange" | "onClick">) => JSX.Element;
