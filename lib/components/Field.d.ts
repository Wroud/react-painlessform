/// <reference types="react" />
import * as React from "react";
import { IErrorMessage } from "../FormValidator";
import { IFieldState } from "../interfaces/field";
import { IFormStorage } from "../interfaces/form";
import { IFormContext } from "./Form";
export declare type InputType<C> = C extends Array<infer V> ? (V extends boolean ? string[] : V) : (C extends boolean ? string : C);
export interface IFieldClass<TModel extends object> {
    new <TValue>(props: IFieldClassProps<TValue, TModel>): FieldClass<TValue, TModel>;
}
export interface IInputHook<TValue, TModel> {
    name: string;
    value: InputType<TValue>;
    multiple: boolean;
    checked: boolean;
    type: string;
    onFocus: () => any;
    onBlur: () => any;
    onClick: () => any;
    onChange: (value: TValue | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => any;
}
export interface IFieldBase<TValue, TModel extends object> {
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
    isFocus: boolean;
    isValid: boolean;
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
export interface IFieldClassProps<TValue, TModel extends object> extends IFieldBase<TValue, TModel> {
    value: TValue;
    /**
     * Value passed to [[Field]]
     */
    forwardedValue: InputType<TValue>;
    /**
     * Field selector from model
     */
    name: (model: TModel) => TValue;
    type: string;
    multiple: boolean;
    onFocus: () => any;
    onBlur: () => any;
    onClick?: () => any;
    onChange?: (value: TValue, nextState?: IFieldState) => any;
    /**
     * Accepts `(context: FieldModelContext<TModel>) => React.ReactNode` function or `React.ReactNode`
     * if `children` is `React.ReactNode` then pass [[FieldModelContext]] via FieldContext
     */
    children?: ((context: IFieldContext<TValue, TModel>) => React.ReactNode) | React.ReactNode;
}
/**
 * Describes FieldContext
 */
export interface IFieldContext<TValue, TModel extends object> extends IFieldBase<TValue, TModel> {
    value: TValue;
    inputHook: IInputHook<TValue, TModel>;
}
export declare const Provider: React.ComponentType<React.ProviderProps<IFieldContext<any, any>>>, Consumer: React.ComponentType<React.ConsumerProps<IFieldContext<any, any>>>;
/**
 * FieldClass React component accepts [[ClassProps]] as props
 */
export declare class FieldClass<TValue, TModel extends object> extends React.Component<IFieldClassProps<TValue, TModel>> {
    static defaultProps: Partial<IFieldContext<any, any>>;
    render(): {};
    /**
     * Mount field to form model if passed `value` is `undefined`
     * with empty string `value`
     */
    componentDidMount(): void;
    componentWillUnmount(): void;
    /**
     * Remount field to form model (if passed `value` is `undefined`)
     * with empty string `value`
     */
    componentDidUpdate(prevProps: IFieldClassProps<TValue, TModel>): void;
    mountValue(): void;
    private handleFocus;
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
     * Call [[Form]] `handleChange` with [[IUpdateEvent]] as argument
     * and call [[onChange]] from props
     */
    private update;
}
/**
 * Describes [[Field]] props
 */
export interface IFieldProps<TValue, TModel extends object> {
    name: (model: TModel) => TValue;
    value?: InputType<TValue>;
    type?: string;
    multiple?: boolean;
    subscribe?: (formState: IFormStorage<TModel>) => any;
    onClick?: () => any;
    onFocus?: () => any;
    onBlur?: () => any;
    onChange?: (value: TValue, nextState?: IFieldState) => any;
    children?: ((context: IFieldContext<TValue, TModel>) => React.ReactNode) | React.ReactNode;
    [key: string]: any;
}
export interface IField<TModel extends object> {
    new <TValue>(props: IFieldProps<TValue, TModel>): Field<TValue, TModel>;
}
/**
 * HOC for [[FieldClass]] that connects [[FormContext]], [[ValidationContext]]
 * and [[TransformContext]] and pass it to [[FieldClass]] as props
 */
export declare class Field<TValue, TModel extends object> extends React.Component<IFieldProps<TValue, TModel>> {
    static defaultProps: {
        type: string;
    };
    formContext: IFormContext<TModel>;
    field: React.RefObject<FieldClass<TValue, TModel>>;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
