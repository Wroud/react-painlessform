/// <reference types="react" />
import * as React from "react";
export interface IFormProps<T> extends React.FormHTMLAttributes<HTMLFormElement> {
    values?: Partial<T>;
    onModelChange?: (nextModel: T, prevModel: T) => any;
    onReset?: () => any;
    [rest: string]: any;
}
export interface IFormState {
    model: any;
    isSubmitting: boolean;
    handleReset: () => any;
    handleChange: (field: string, value: any) => any;
}
export declare const Provider: React.ComponentClass<{
    value: IFormState;
}>, Consumer: React.ComponentClass<{
    children?: (context: IFormState) => React.ReactNode;
}>;
export declare class Form<T = {}> extends React.Component<IFormProps<T>, IFormState> {
    static getDerivedStateFromProps(props: IFormProps<any>, state: IFormState): any;
    constructor(props: IFormProps<T>);
    shouldComponentUpdate(nextProps: IFormProps<T>, nextState: IFormState): boolean;
    componentDidUpdate(prevProps: IFormProps<any>, prevState: IFormState): void;
    render(): JSX.Element;
    private handleSubmit;
    private handleReset;
    private handleChange;
}
