import * as React from "react";
import shallowequal from "shallowequal";
import { FormErrors } from "../FormValidator";
import { IValidator } from "../Validator";
import { Consumer as FormContext, IFormState } from "./Form";

interface IValidationProps {
    isValid?: boolean;
    errors?: FormErrors<any>;
    validator?: IValidator<any, FormErrors<any>>;
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
            const preErrors = validator.validate(form.model, this.state, this.props);
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
