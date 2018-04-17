/// <reference types="react" />
import * as React from "react";
import { IValidator } from "../ArrayValidator";
import { FormErrors } from "../FormValidator";
import { IFormState } from "./Form";
export interface IValidationProps {
    isValid?: boolean;
    errors?: FormErrors<any>;
    validator?: IValidator<any, FormErrors<any>, IValidationMeta>;
    [rest: string]: any;
}
export interface IValidationMeta {
    state: any;
    props: IValidationProps;
}
export interface IValidationContext {
    errors: FormErrors<any>;
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
        isValid: boolean;
    };
    validate(form: IFormState): {
        isValid: boolean;
        errors: FormErrors<any>;
    };
    render(): JSX.Element;
}
