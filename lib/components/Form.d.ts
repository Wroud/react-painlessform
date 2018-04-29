/// <reference types="react" />
import * as React from "react";
import { IFieldState } from "../interfaces/field";
import { FormModel, IFormConfiguration } from "../interfaces/form";
/**
 * Describes [[Form]] props
 */
export interface IFormProps<T> extends React.FormHTMLAttributes<HTMLFormElement> {
    /**
     * Via this prop you can controll form via `Redux` as example
     * if passed you need control `isSubmitting` `isChanged` by yourself
     */
    values?: Partial<T>;
    /**
     * Sets inital form values on mount and when reset
     */
    initValues?: Partial<T>;
    /**
     * That prop allows you configure form
     */
    configure?: IFormConfiguration;
    /**
     * If `true` form will be reset and sets passed `values`
     * example when you need set new values you want to reset all `isChanged`, `isVisited`
     * [[Field]] props to `false`
     */
    isReset?: boolean;
    isChanged?: boolean;
    isSubmitting?: boolean;
    /**
     * Fire when [[Form]] [[model]] changed
     */
    onModelChange?: (nextModel: T, prevModel: T) => any;
    onReset?: () => any;
    /**
     * Fire when form submits
     */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => (values: T) => any;
    [rest: string]: any;
}
/**
 * Describes [[Form]] state and [[FormContext]]
 */
export interface IFormState<T> {
    /**
     * Current form values and [[Field]] flags
     */
    model: FormModel<T>;
    /**
     * Derived from props
     */
    configure?: IFormConfiguration;
    isChanged: boolean;
    isSubmitting: boolean;
    /**
     * Reset form to `initValues` and call [[onReset]] from props
     */
    handleReset: () => any;
    /**
     * Update [[model]] [[Field]] state and call [[onModelChange]] from props
     */
    handleChange: (field: keyof T, value: IFieldState<T[typeof field]>) => any;
    /**
     * Used for updating multiple field values and call [[onModelChange]] from props
     */
    handleTransform: (value: Partial<FormModel<T>>) => any;
}
export interface IForm<T = {}> extends Form<T> {
    new (props: IFormProps<T>): Form<T>;
}
/**
 * Default [[Form]] configuration
 */
export declare const defaultConfiguration: IFormConfiguration;
export declare const Provider: React.ComponentClass<{
    value: IFormState<any>;
}>, Consumer: React.ComponentClass<{
    children?: (context: IFormState<any>) => React.ReactNode;
}>;
/**
 * Form component controlls [[Field]]s and passes [[FormContext]]
 */
export declare class Form<T = {}> extends React.Component<IFormProps<T>, IFormState<T>> {
    static defaultProps: Partial<IFormProps<any>>;
    static getDerivedStateFromProps(props: IFormProps<any>, state: IFormState<any>): {
        model: FormModel<any>;
        configure: IFormConfiguration;
        isChanged: boolean;
        isSubmitting: boolean;
    };
    constructor(props: IFormProps<T>);
    /**
     * [[Form]] rerenders only if `model` or `props` changed
     */
    shouldComponentUpdate(nextProps: IFormProps<T>, nextState: IFormState<T>): boolean;
    /**
     * After form did rerendered call [[onModelChange]] from props
     */
    componentDidUpdate(prevProps: IFormProps<any>, prevState: IFormState<T>): void;
    render(): JSX.Element;
    /**
     * Transform `model` to `values` and call `onModelChange`
     */
    private callModelChange(model, prevModel);
    /**
     * Handles form submitting and `preventDefault` if
     * `configure.submitting.preventDefault` === true
     * sets all [[Field]]s `isChanged` to `false` and `isVisited` to `true`
     * and fires [[onSubmit]] from props
     */
    private handleSubmit;
    /**
     * Reset form to [[initValues]]
     */
    private handleReset;
    /**
     * Update [[Field]] state with new `value` and sets form `isChanged` to `true`
     */
    private handleChange;
    /**
     * Update [[Field]]s state with new `values` and sets form `isChanged` to `true`
     */
    private handleTransform;
}
