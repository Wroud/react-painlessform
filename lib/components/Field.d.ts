/// <reference types="react" />
import * as React from "react";
import { IErrorMessage } from "../FormValidator";
import { IFieldState } from "../interfaces/field";
import { IFormState } from "./Form";
export declare type Exclude<C, U extends keyof M, M> = C extends M[U] ? M[U] : never;
export declare type ExtendFieldClass<TName extends keyof TModel, TValue extends TModel[TName], TModel> = TName extends keyof TModel ? IFieldClassProps<TName, Exclude<TValue, TName, TModel>, TModel> : never;
export declare type IClassProps<T> = ExtendFieldClass<keyof T, T[keyof T], T>;
export interface IFieldClass<T> extends FieldClass<T> {
    new (props: IClassProps<T>): FieldClass<T>;
}
export interface IFieldClassProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    value: TValue;
    formState: IFormState<TModel>;
    validationErrors: Array<IErrorMessage<any>>;
    validationScope: Array<IErrorMessage<any>>;
    isVisited: boolean;
    isChanged: boolean;
    isValid: boolean;
    name: TName;
    children?: ((state: IFieldClassProps<TName, TValue, TModel>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<TValue>) => any;
    [key: string]: any;
}
export declare const Provider: React.ComponentClass<{
    value: IFieldClassProps<string, any, any>;
}>, Consumer: React.ComponentClass<{
    children?: (context: IFieldClassProps<string, any, any>) => React.ReactNode;
}>;
export declare class FieldClass<T> extends React.Component<IClassProps<T>> {
    private inputValue;
    render(): JSX.Element;
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: IClassProps<T>): boolean;
    private setVisited();
    private onClick;
    private handleChange;
    private update;
}
export interface IFieldProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    name: TName;
    value?: TValue;
    children?: ((state: IClassProps<TModel>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<TValue>) => any;
    [key: string]: any;
}
export declare type ExtendFieldProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> = TName extends keyof TModel ? IFieldProps<TName, Exclude<TValue, TName, TModel>, TModel> : never;
export declare type FieldProps<T> = ExtendFieldProps<keyof T, T[keyof T], T>;
export interface IField<T> extends Field<T> {
    new (props: FieldProps<T>): Field<T>;
}
export declare class Field<T> extends React.Component<FieldProps<T>> {
    render(): any;
}
