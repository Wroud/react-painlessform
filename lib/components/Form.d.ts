/// <reference types="react" />
import * as React from "react";
import { IUpdateEvent } from "../interfaces/field";
import { FieldsState, IFormConfiguration, IFormStorage } from "../interfaces/form";
import { Field } from "./Field";
/**
 * Describes [[Form]] props
 */
export interface IFormProps<TModel extends object> extends React.FormHTMLAttributes<HTMLFormElement> {
    /**
     * You can control form by yourself by passing `values` and `state`
     * Must be passed with `isSubmitting` `isChanged` props
     */
    values?: TModel;
    state?: FieldsState<TModel>;
    /**
     * Sets inital form values when mount and reset
     */
    initValues?: TModel;
    initState?: FieldsState<TModel>;
    /**
     * That prop allows you configure form
     */
    config?: IFormConfiguration;
    /**
     * If `true` form will be first reset and after sets passed `values`
     * example when you need set new values you want to reset all `isChanged`, `isVisited`
     * [[Field]] props to `false`
     */
    isReset?: boolean;
    isChanged?: boolean;
    isSubmitting?: boolean;
    /**
     * Fire when [[Form]] changed
     */
    onModelChange?: (nextModel: TModel, prevModel: TModel) => any;
    onReset?: (event: React.FormEvent<HTMLFormElement>) => any;
    /**
     * Fire when form submitting
     */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => (values: TModel, isValid: boolean) => any;
    [rest: string]: any;
}
export interface IFormContext<TModel extends object> {
    storage: IFormStorage<TModel>;
    /**
     * Reset form to `initValues` and call [[onReset]] from props
     */
    handleReset: () => any;
    /**
     * Update [[model]] [[Field]] state and call [[onModelChange]] from props
     */
    handleChange: (event: IUpdateEvent) => any;
    mountField: (value: Field<any, TModel>) => any;
    unMountField: (value: Field<any, TModel>) => any;
}
/**
 * Default [[Form]] configuration
 */
export declare const defaultConfiguration: IFormConfiguration;
export declare const Provider: React.ComponentType<React.ProviderProps<IFormContext<{}>>>, Consumer: React.ComponentType<React.ConsumerProps<IFormContext<{}>>>;
export interface IForm<TModel extends object> extends Form<TModel> {
    new (props: IFormProps<TModel>): Form<TModel>;
}
/**
 * Form component controlls [[Field]]s and passes [[FormContext]]
 */
export declare class Form<TModel extends object> extends React.Component<IFormProps<TModel>> {
    static defaultProps: Partial<IFormProps<any>>;
    private fields;
    private transform;
    private validation;
    private storage;
    constructor(props: IFormProps<TModel>);
    readonly getStorage: IFormStorage<TModel>;
    readonly getFields: Field<any, TModel>[];
    /**
     * [[Form]] update [[storage]]
     */
    shouldComponentUpdate(nextProps: IFormProps<TModel>): boolean;
    render(): JSX.Element;
    componentDidMount(): void;
    private validate();
    private updateState(state);
    private resetToInital(initalValues?);
    private mountField;
    private unMountField;
    /**
     * Transform `model` to `values` and call `onModelChange`
     */
    private callModelChange(prevModel);
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
    private invokeFieldsUpdate();
    /**
     * Update [[Field]] state with new `value` and sets form `isChanged` to `true`
     */
    private handleChange;
}
