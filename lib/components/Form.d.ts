/// <reference types="react" />
import * as React from "react";
import { IUpdateEvent, UpdateValue } from "../interfaces/field";
import { FieldsState, IFormConfiguration, IFormStorage } from "../interfaces/form";
import { Field as CField } from "./Field";
import { ITranformProps } from "./Transform";
import { IValidationProps } from "./Validation";
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
    /**
     * Fire when [[Form]] changed
     */
    onModelChange?: (nextModel: TModel, prevModel: TModel) => any;
    onReset?: (event?: React.FormEvent<HTMLFormElement>) => any;
    /**
     * Fire when form submitting
     */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => (values: TModel, isValid: boolean) => any;
    [rest: string]: any;
}
export declare type FormProps<TModel extends object> = IFormProps<TModel> & IValidationProps<TModel> & ITranformProps<TModel>;
export interface IFormContext<TModel extends object> {
    storage: IFormStorage<TModel>;
    /**
     * Reset form to `initValues` and call [[onReset]] from props
     */
    handleReset: () => any;
    /**
     * Update [[model]] [[Field]] state and call [[onModelChange]] from props
     */
    handleChange: (event: IUpdateEvent<TModel, UpdateValue>) => any;
    mountField: (value: CField<any, TModel, any>) => any;
    unMountField: (value: CField<any, TModel, any>) => any;
}
/**
 * Default [[Form]] configuration
 */
export declare const defaultConfiguration: IFormConfiguration;
export declare const Provider: React.ComponentType<React.ProviderProps<IFormContext<any>>>, Consumer: React.ComponentType<React.ConsumerProps<IFormContext<any>>>;
export interface IForm<TModel extends object> extends Form<TModel> {
    new (props: FormProps<TModel>): Form<TModel>;
}
/**
 * Form component controlls [[Field]]s and passes [[FormContext]]
 */
export declare class Form<TModel extends object> extends React.Component<FormProps<TModel>> {
    static defaultProps: Partial<FormProps<any>>;
    private fields;
    private transform;
    private validation;
    private subscribers;
    private storage;
    constructor(props: FormProps<TModel>);
    readonly getStorage: IFormStorage<TModel>;
    readonly getFields: CField<any, TModel, any>[];
    /**
     * [[Form]] update [[storage]]
     */
    shouldComponentUpdate(nextProps: FormProps<TModel>): boolean;
    render(): JSX.Element;
    componentDidMount(): void;
    private validate();
    private updateState(state);
    private resetToInital(initalValues?, initalState?);
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
    /**
     * Update [[Field]] state with new `value` and sets form `isChanged` to `true`
     */
    private handleChange;
    private mountField;
    private unMountField;
}
