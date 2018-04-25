/// <reference types="react" />
import * as React from "react";
import * as Yup from "yup";
import { IValidator } from "../ArrayValidator";
import { FormErrors, IErrorMessage } from "../FormValidator";
import { IValidationConfiguration, IValidationMeta } from "../interfaces/validation";
import { IFormState } from "./Form";
export interface IValidationProps<T> {
    errors?: FormErrors<T>;
    scope?: Array<IErrorMessage<any>>;
    validator?: IValidator<T, FormErrors<T>, IValidationMeta<T>> | Yup.Schema<T>;
    scopeValidator?: IValidator<T, Array<IErrorMessage<any>>, IValidationMeta<T>>;
    configure?: IValidationConfiguration & Yup.ValidateOptions;
    isValid?: boolean;
    [rest: string]: any;
}
export interface IValidationContext<T> {
    errors: FormErrors<T>;
    scope: Array<IErrorMessage<any>>;
    isValid: boolean;
}
export declare const Provider: React.ComponentClass<{
    value: IValidationContext<any>;
}>, Consumer: React.ComponentClass<{
    children?: (context: IValidationContext<any>) => React.ReactNode;
}>;
export interface IValidation<T = {}> extends Validation<T> {
    new (props: IValidationProps<T>): Validation<T>;
}
export declare class Validation<T> extends React.Component<IValidationProps<T>, any> {
    static defaultProps: IValidationProps<any>;
    prevErrors: {
        errors: FormErrors<T>;
        scope: IErrorMessage<any>[];
        isValid: boolean;
    };
    validate: (form: IFormState<T>) => IValidationContext<T>;
    render(): JSX.Element;
}
