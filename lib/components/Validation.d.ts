/// <reference types="react" />
import * as React from "react";
import * as Yup from "yup";
import { IValidator } from "../ArrayValidator";
import { FormErrors, IErrorMessage } from "../FormValidator";
import { IFormState } from "./Form";
export interface IValidationProps {
    errors?: FormErrors<any>;
    scope?: Array<IErrorMessage<any>>;
    isValid?: boolean;
    validator?: IValidator<any, FormErrors<any>, IValidationMeta> | Yup.Schema<any>;
    scopeValidator?: IValidator<any, Array<IErrorMessage<any>>, IValidationMeta>;
    [rest: string]: any;
}
export interface IValidationMeta {
    state: any;
    props: IValidationProps;
}
export interface IValidationContext {
    errors: FormErrors<any>;
    scope: Array<IErrorMessage<any>>;
    isValid: boolean;
}
export declare const Provider: React.ComponentClass<{
    value: IValidationContext;
}>, Consumer: React.ComponentClass<{
    children?: (context: IValidationContext) => React.ReactNode;
}>;
export declare class Validation extends React.Component<IValidationProps, any> {
    prevErrors: {
        errors: FormErrors<any>;
        scope: IErrorMessage<any>[];
        isValid: boolean;
    };
    validate: (form: IFormState<any>) => IValidationContext;
    render(): JSX.Element;
}
