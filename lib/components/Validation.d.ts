/// <reference types="react" />
import * as React from "react";
import * as Yup from "yup";
import { IValidator } from "../ArrayValidator";
import { FormErrors } from "../FormValidator";
import { IFormState } from "./Form";
export interface IValidationProps {
    errors?: FormErrors<any>;
    scope?: string[];
    isValid?: boolean;
    validator?: IValidator<any, FormErrors<any>, IValidationMeta> | Yup.Schema<any>;
    scopeValidator?: IValidator<any, string[], IValidationMeta>;
    [rest: string]: any;
}
export interface IValidationMeta {
    state: any;
    props: IValidationProps;
}
export interface IValidationContext {
    errors: FormErrors<any>;
    scope: string[];
    isValid: boolean;
}
export declare const Provider: React.ComponentClass<{
    value: IValidationContext;
}>, Consumer: React.ComponentClass<{
    children?: (context: IValidationContext) => React.ReactNode;
}>;
export declare class Validation extends React.Component<IValidationProps, any> {
    prevErrors: {
        errors: {};
        scope: string[];
        isValid: boolean;
    };
    validate: (form: IFormState) => IValidationContext;
    render(): JSX.Element;
}
