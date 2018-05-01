/// <reference types="react" />
import * as React from "react";
import { IErrorMessage } from "../FormValidator";
import { IFieldState } from "../interfaces/field";
import { IFormContext, IFormState } from "./Form";
export declare type MapExclude<C, U extends keyof M, M> = C extends M[U] ? M[U] : never;
export declare type ExtendFieldClass<TName extends keyof TModel, TValue extends TModel[TName], TModel> = TName extends keyof TModel ? IFieldClassProps<TName, MapExclude<TValue, TName, TModel>, TModel> : never;
export declare type ClassProps<T> = ExtendFieldClass<keyof T, T[keyof T], T>;
export declare type ExtendFieldContext<TName extends keyof TModel, TValue extends TModel[TName], TModel> = TName extends keyof TModel ? IFieldContext<TName, MapExclude<TValue, TName, TModel>, TModel> : never;
export declare type FieldModelContext<T> = ExtendFieldContext<keyof T, T[keyof T], T>;
export interface IFieldClass<T> extends FieldClass<T> {
    new (props: ClassProps<T>): FieldClass<T>;
}
export interface IFieldBase<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    /**
     * Value of [[FieldClass]]
     */
    value: TValue;
    /**
     * [[Form]] context
     */
    form: IFormContext<TModel>;
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
     * Rest passed to [[Field]]
     */
    rest: {
        [key: string]: any;
    };
}
/**
 * Describes props for [[FieldClass]]
 */
export interface IFieldClassProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> extends IFieldBase<TName, TValue, TModel> {
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
}
/**
 * Describes FieldContext
 */
export interface IFieldContext<TName extends keyof TModel, TValue extends TModel[TName], TModel> extends IFieldBase<TName, TValue, TModel> {
    /**
     * Click event handler
     */
    onClick?: () => any;
    onChange?: (value: TValue | React.ChangeEvent<HTMLInputElement>) => any;
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
     * Remount field to form model (if passed `value` is `undefined`)
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
    subscribe?: (formState: IFormState<TModel>) => any;
    children?: ((context: FieldModelContext<TModel>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<TValue>) => any;
    [key: string]: any;
}
export declare type ExtendFieldProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> = TName extends keyof TModel ? IFieldProps<TName, MapExclude<TValue, TName, TModel>, TModel> : never;
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
