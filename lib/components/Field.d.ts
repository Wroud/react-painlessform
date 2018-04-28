/// <reference types="react" />
import * as React from "react";
import { IErrorMessage } from "../FormValidator";
import { IFieldState } from "../interfaces/field";
import { IFormState } from "./Form";
export declare type Exclude<C, U extends keyof M, M> = C extends M[U] ? M[U] : never;
export declare type ExtendFieldClass<TName extends keyof TModel, TValue extends TModel[TName], TModel> = TName extends keyof TModel ? IFieldClassProps<TName, Exclude<TValue, TName, TModel>, TModel> : never;
export declare type ClassProps<T> = ExtendFieldClass<keyof T, T[keyof T], T>;
export declare type ExtendFieldContext<TName extends keyof TModel, TValue extends TModel[TName], TModel> = TName extends keyof TModel ? IFieldContext<TName, Exclude<TValue, TName, TModel>, TModel> : never;
export declare type FieldModelContext<T> = ExtendFieldContext<keyof T, T[keyof T], T>;
export interface IFieldClass<T> extends FieldClass<T> {
    new (props: ClassProps<T>): FieldClass<T>;
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
    children?: ((context: FieldModelContext<TModel>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<TValue>) => any;
    rest: {
        [key: string]: any;
    };
}
export interface IFieldContext<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    value: TValue;
    formState: IFormState<TModel>;
    validationErrors: Array<IErrorMessage<any>>;
    validationScope: Array<IErrorMessage<any>>;
    isVisited: boolean;
    isChanged: boolean;
    isValid: boolean;
    name: TName;
    onClick?: () => any;
    onChange?: (value: TValue | React.ChangeEvent<HTMLInputElement>) => any;
    rest: {
        [key: string]: any;
    };
}
export declare const Provider: React.ComponentClass<{
    value: IFieldContext<string, any, any>;
}>, Consumer: React.ComponentClass<{
    children?: (context: IFieldContext<string, any, any>) => React.ReactNode;
}>;
export declare class FieldClass<T> extends React.Component<ClassProps<T>> {
    static defaultProps: Partial<IFieldContext<string, any, any>>;
    render(): any;
    componentDidMount(): void;
    componentDidUpdate(prevProps: ClassProps<T>): void;
    shouldComponentUpdate(nextProps: ClassProps<T>): boolean;
    private setVisited();
    private onClick;
    private handleChange;
    private update;
}
export interface IFieldProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    name: TName;
    subscribe: (formState: IFormState<TModel>) => any;
    children?: ((context: FieldModelContext<TModel>) => React.ReactNode) | React.ReactNode;
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
    render(): JSX.Element;
}
