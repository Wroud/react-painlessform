/// <reference types="react" />
import * as React from "react";
import { IErrorMessage } from "../FormValidator";
import { IFieldState } from "../interfaces/field";
import { IFormState } from "./Form";
export interface IFieldClass<N extends keyof T, V extends T[N], T> extends FieldClass<N, V, T> {
    new (props: IFieldClassProps<N, V, T>): FieldClass<N, V, T>;
}
export interface IFieldClassProps<N extends keyof T, V extends T[N], T> {
    value: V;
    formState: IFormState<T>;
    validationErrors: Array<IErrorMessage<any>>;
    validationScope: Array<IErrorMessage<any>>;
    isVisited: boolean;
    isChanged: boolean;
    isValid: boolean;
    name: N;
    children?: ((state: IFieldClassProps<N, V, T>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<V>) => any;
    [key: string]: any;
}
export declare const Provider: React.ComponentClass<{
    value: IFieldClassProps<any, any, any>;
}>, Consumer: React.ComponentClass<{
    children?: (context: IFieldClassProps<any, any, any>) => React.ReactNode;
}>;
export declare class FieldClass<N extends keyof T, V extends T[N], T> extends React.Component<IFieldClassProps<N, V, T>> {
    private inputValue;
    render(): JSX.Element;
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: IFieldClassProps<N, V, T>): boolean;
    private setVisited();
    private onClick;
    private handleChange;
    private update;
}
export interface IFieldProps<N extends keyof T, V extends T[N], T> {
    name: N;
    children?: ((state: IFieldClassProps<N, V, T>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<V>) => any;
    [key: string]: any;
}
export interface IField<N extends keyof T, V extends T[N], T> extends Field<N, V, T> {
    new (props: IFieldProps<N, V, T>): Field<N, V, T>;
}
export declare class Field<N extends keyof T, V extends T[N], T> extends React.Component<IFieldProps<N, V, T>> {
    render(): JSX.Element;
}
