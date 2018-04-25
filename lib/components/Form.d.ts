/// <reference types="react" />
import * as React from "react";
import { IFieldState } from "../interfaces/field";
import { FormModel, IFormConfiguration } from "../interfaces/form";
export interface IFormProps<T> extends React.FormHTMLAttributes<HTMLFormElement> {
    values?: Partial<T>;
    initValues?: Partial<T>;
    configure?: IFormConfiguration;
    isReset?: boolean;
    isChanged?: boolean;
    isSubmitting?: boolean;
    onModelChange?: (nextModel: T, prevModel: T) => any;
    onReset?: () => any;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => (values: T) => any;
    [rest: string]: any;
}
export interface IFormState<T> {
    model: FormModel<T>;
    configure?: IFormConfiguration;
    isChanged: boolean;
    isSubmitting: boolean;
    handleReset: () => any;
    handleChange: (field: keyof T, value: IFieldState<T[typeof field]>) => any;
    handleTransform: (value: Partial<FormModel<T>>) => any;
}
export interface IForm<T = {}> extends Form<T> {
    new (props: IFormProps<T>): Form<T>;
}
export declare const defaultConfiguration: IFormConfiguration;
export declare const Provider: React.ComponentClass<{
    value: IFormState<any>;
}>, Consumer: React.ComponentClass<{
    children?: (context: IFormState<any>) => React.ReactNode;
}>;
export declare class Form<T = {}> extends React.Component<IFormProps<T>, IFormState<T>> {
    static defaultProps: Partial<IFormProps<any>>;
    static getDerivedStateFromProps(props: IFormProps<any>, state: IFormState<any>): {
        model: FormModel<any>;
        configure: IFormConfiguration;
        isChanged: boolean;
        isSubmitting: boolean;
    };
    constructor(props: IFormProps<T>);
    shouldComponentUpdate(nextProps: IFormProps<T>, nextState: IFormState<T>): boolean;
    componentDidUpdate(prevProps: IFormProps<any>, prevState: IFormState<T>): void;
    render(): JSX.Element;
    private callModelChange(model, prevModel);
    private handleSubmit;
    private handleReset;
    private handleChange;
    private handleTransform;
}
