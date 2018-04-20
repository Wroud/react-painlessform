import * as React from "react";
import shallowequal = require("shallowequal");
import * as Yup from "yup";
import { IValidator } from "../ArrayValidator";
import { FormErrors } from "../FormValidator";
import { Consumer as FormContext, IFormState } from "./Form";

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

const NoErrors = {};
const NoScopeErrors: string[] = [];

export const { Provider, Consumer } = React.createContext<IValidationContext>({
    errors: NoErrors,
    scope: NoScopeErrors,
    isValid: true,
});

export class Validation extends React.Component<IValidationProps, any> {
    prevErrors = {
        errors: NoErrors,
        scope: NoScopeErrors,
        isValid: true,
    };
    validate = (form: IFormState<any>): IValidationContext => {
        if (this.props.errors || this.props.scope) {
            return {
                errors: this.props.errors,
                scope: this.props.scope,
                isValid: this.props.isValid,
            };
        }

        const { validator, scopeValidator } = this.props;

        let errors = NoErrors;
        let scope = NoScopeErrors;
        let isValid = true;
        if (validator && form.model) {
            if ((validator as Yup.Schema<any>).validateSync) {
                try {
                    (validator as Yup.Schema<any>).validateSync(form.model, {
                        abortEarly: false,
                        context: {
                            state: this.state,
                            props: this.props,
                        },
                        ...form.configure.validation,
                    });
                } catch (_errors) { // : Yup.ValidationError
                    if (_errors.path === undefined) {
                        _errors.inner.forEach(error => {
                            errors = {
                                ...errors,
                                [error.path]: [...(errors[error.path] || []), ...error.errors],
                            };
                        });
                    } else {
                        this.context = _errors.errors;
                    }
                    isValid = false;
                }
            } else {
                const preErrors = (validator as IValidator<any, FormErrors<any>, IValidationMeta>).validate(
                    form.model,
                    {
                        state: this.state,
                        props: this.props,
                    },
                );
                for (const key of Object.keys(preErrors)) {
                    if (preErrors[key].length > 0) {
                        isValid = false;
                        errors = preErrors;
                        break;
                    }
                }
            }
        }
        if (scopeValidator && form.model) {
            const preScope = scopeValidator.validate(
                form.model,
                {
                    state: this.state,
                    props: this.props,
                },
            );
            if (preScope.length > 0) {
                isValid = false;
                scope = preScope;
            }
        }

        const result = { errors, scope, isValid };

        if (!shallowequal(result, this.prevErrors)) {
            this.prevErrors = result;
            return result;
        } else {
            return this.prevErrors;
        }
    }

    render() {
        return (
            <FormContext>
                {context => <Provider value={this.validate(context)}>{this.props.children}</Provider>}
            </FormContext>
        );
    }
}
