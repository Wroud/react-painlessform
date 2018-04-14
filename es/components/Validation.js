import * as React from "react";
import shallowequal from "shallowequal";
import { Consumer as FormContext } from "./Form";
const NoErrors = {};
export const { Provider, Consumer } = React.createContext({
    errors: NoErrors,
    isValid: true,
});
export class Validation extends React.Component {
    constructor() {
        super(...arguments);
        this.prevErrors = {
            errors: NoErrors,
            isValid: true,
        };
    }
    validate(form) {
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
        }
        else {
            return this.prevErrors;
        }
    }
    render() {
        return (React.createElement(FormContext, null, context => React.createElement(Provider, { value: this.validate(context) }, this.props.children)));
    }
}
