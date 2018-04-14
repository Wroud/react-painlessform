import * as React from "react";
import shallowequal = require("shallowequal");
import { IValidator } from "../ArrayValidator";
import { FormErrors } from "../FormValidator";
import { Consumer as FormContext, IFormState } from "./Form";

export interface IValidationProps {
    isValid?: boolean;
    errors?: FormErrors<any>;
    validator?: IValidator<any, FormErrors<any>, { state: IValidationState, props: IValidationProps }>;
    [rest: string]: any;
}

export interface IValidationState {
    errors: FormErrors<any>;
    isValid: boolean;
}

const NoErrors = {};

export const { Provider, Consumer } = React.createContext<IValidationState>({
    errors: NoErrors,
    isValid: true,
});

export class Validation extends React.Component<IValidationProps, IValidationState> {
    prevErrors = {
        errors: NoErrors,
        isValid: true,
    };
    validate(form: IFormState) {
        if (this.props.errors) {
            return {
                isValid: this.props.isValid,
                errors: this.props.errors,
            };
        }

        const { validator } = this.props;

        let errors = NoErrors;
        let isValid = true;
        if (validator && form.model) {
            const preErrors = validator.validate(
                form.model,
                {
                    state: this.state,
                    props: this.props,
                },
            );
            for (const key of Object.keys(preErrors)) {
                if (preErrors[key].length > 0) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) {
                errors = preErrors;
            }
        }

        const result = { isValid, errors };

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
