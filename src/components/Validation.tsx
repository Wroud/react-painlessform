import * as React from "react";
import shallowequal = require("shallowequal");
import * as Yup from "yup";

import { IValidator } from "../ArrayValidator";
import { FormErrors, IErrorMessage } from "../FormValidator";
import { getValuesFromModel } from "../helpers/form";
import { IValidationMeta } from "../interfaces/validation";
import { Consumer as FormContext, IFormState } from "./Form";

export interface IValidationProps {
    errors?: FormErrors<any>;
    scope?: Array<IErrorMessage<any>>;
    isValid?: boolean;
    validator?: IValidator<any, FormErrors<any>, IValidationMeta> | Yup.Schema<any>;
    scopeValidator?: IValidator<any, Array<IErrorMessage<any>>, IValidationMeta>;
    [rest: string]: any;
}

export interface IValidationContext {
    errors: FormErrors<any>;
    scope: Array<IErrorMessage<any>>;
    isValid: boolean;
}

// tslint:disable-next-line:no-object-literal-type-assertion
const NoErrors = {} as FormErrors<any>;
const NoScopeErrors: Array<IErrorMessage<any>> = [];

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
        const model = getValuesFromModel(form.model);
        if (validator && model) {
            if ((validator as Yup.Schema<any>).validateSync) {
                try {
                    (validator as Yup.Schema<any>).validateSync(model, {
                        abortEarly: false,
                        context: {
                            state: this.state,
                            props: this.props,
                        },
                        ...form.configure.validation,
                    });
                } catch (_errors) {
                    const __errors: Yup.ValidationError = _errors;
                    if (__errors.path === undefined) {
                        __errors.inner.forEach(error => {
                            errors = {
                                ...errors,
                                [error.path]:
                                    [...(errors[error.path] || []),
                                    ...error.errors.map(message => ({ message }))],
                            };
                        });
                    } else {
                        this.context = __errors.errors;
                    }
                    isValid = false;
                }
            } else {
                const preErrors = (validator as IValidator<any, FormErrors<any>, IValidationMeta>).validate(
                    model,
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
        if (scopeValidator && model) {
            const preScope = scopeValidator.validate(
                model,
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
