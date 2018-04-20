/// <reference types="react" />
import * as React from "react";
export interface IFormConfiguration {
    submitting: {
        preventDefault: boolean;
    };
    validation: any;
}
export declare const defaultConfiguration: IFormConfiguration;
export interface IFormProps<T> extends React.FormHTMLAttributes<HTMLFormElement> {
    values?: Partial<T>;
    configure?: IFormConfiguration;
    onModelChange?: (nextModel: T, prevModel: T) => any;
    onReset?: () => any;
    [rest: string]: any;
}
export interface IFormState {
    model: any;
    isSubmitting: boolean;
    configure?: IFormConfiguration;
    handleReset: () => any;
    handleChange: (field: string, value: any) => any;
}
export interface IForm<T = {}> extends Form<T> {
    new (props: IFormProps<T>): Form<T>;
}
export declare const Provider: React.ComponentClass<{
    value: IFormState;
}>, Consumer: React.ComponentClass<{
    children?: (context: IFormState) => React.ReactNode;
}>;
export declare class Form<T = {}> extends React.Component<IFormProps<T>, IFormState> {
    static defaultProps: Partial<IFormProps<any>>;
    static getDerivedStateFromProps(props: IFormProps<any>, state: IFormState): any;
    constructor(props: IFormProps<T>);
    shouldComponentUpdate(nextProps: IFormProps<T>, nextState: IFormState): boolean;
    componentDidUpdate(prevProps: IFormProps<any>, prevState: IFormState): void;
    render(): JSX.Element;
    private handleSubmit;
    private handleReset;
    private handleChange;
}
