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
/**
 * Describes props for [[FieldClass]]
 */
export interface IFieldClassProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    /**
     * Value of [[FieldClass]]
     */
    value: TValue;
    /**
     * [[Form]] context
     */
    formState: IFormState<TModel>;
    /**
     * Validation errors from [[Validation]] context
     */
    validationErrors: Array<IErrorMessage<any>>;
    /**
     * Form scope Validation errors from [[Validation]] context
     */
    validationScope: Array<IErrorMessage<any>>;
    isVisited: boolean;
    isChanged: boolean;
    isValid: boolean;
    /**
     * Field name
     */
    name: TName;
    /**
     * Accepts `(context: FieldModelContext<TModel>) => React.ReactNode` function or `React.ReactNode`
     * if `children` is `React.ReactNode` then pass [[FieldModelContext]] via FieldContext
     */
    children?: ((context: FieldModelContext<TModel>) => React.ReactNode) | React.ReactNode;
    /**
     * Click event handler
     */
    onClick?: () => any;
    /**
     * Change [[Form]] event handler
     */
    onChange?: (field: string, value: IFieldState<TValue>) => any;
    /**
     * Rest passed to [[Field]]
     */
    rest: {
        [key: string]: any;
    };
}
/**
 * Describes FieldContext
 */
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
    /**
     * Click event handler
     */
    onChange?: (value: TValue | React.ChangeEvent<HTMLInputElement>) => any;
    rest: {
        [key: string]: any;
    };
}
export declare const Provider: React.ComponentType<React.ProviderProps<IFieldContext<string, any, any>>>, Consumer: React.ComponentType<React.ConsumerProps<IFieldContext<string, any, any>>>;
/**
 * FieldClass React component accepts [[ClassProps]] as props
 */
export declare class FieldClass<T> extends React.Component<ClassProps<T>> {
    static defaultProps: Partial<IFieldContext<string, any, any>>;
    render(): any;
    /**
     * Mount field to form model if passed `value` is `undefined`
     * with empty string `value`
     */
    componentDidMount(): void;
    /**
     * Remount field to form model if passed `value` is `undefined`
     * with empty string `value`
     */
    componentDidUpdate(prevProps: ClassProps<T>): void;
    /**
     * Field updates only if
     * `value` || `name` || `isVisited` || `isChanged`
     * `isValid` || `validationErrors` || `validationScope`
     * `rest` was changed
     */
    shouldComponentUpdate(nextProps: ClassProps<T>): boolean;
    /**
     * Update field `isVisited` to `true`
     */
    private setVisited();
    /**
     * Call [[setVisited]] and [[onClick]]
     */
    private onClick;
    /**
     * Get `value` from `React.ChangeEvent<HTMLInputElement>` or pass as it is
     * set `isVisited` & `isChanged` to `true`
     */
    private handleChange;
    /**
     * Call [[Form]] `handleChange` with `name` & new `value`
     * and call [[onChange]] from props
     */
    private update;
}
/**
 * Describes [[Field]] props
 */
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
/**
 * HOC for [[FieldClass]] that connects [[FormContext]], [[ValidationContext]]
 * and [[TransformContext]] and pass it to [[FieldClass]] as props
 */
export declare class Field<T> extends React.Component<FieldProps<T>> {
    render(): JSX.Element;
}
