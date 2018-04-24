"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const shallowequal = require("shallowequal");
const form_1 = require("../helpers/form");
const Form_1 = require("./Form");
const NoErrors = {};
const NoScopeErrors = [];
_a = React.createContext({
    errors: NoErrors,
    scope: NoScopeErrors,
    isValid: true,
}), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class Validation extends React.Component {
    constructor() {
        super(...arguments);
        this.prevErrors = {
            errors: NoErrors,
            scope: NoScopeErrors,
            isValid: true,
        };
        this.validate = (form) => {
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
            const model = form_1.getValuesFromModel(form.model);
            if (!model) {
                return { errors, scope, isValid };
            }
            if (validator) {
                if (validator.validateSync) {
                    try {
                        validator.validateSync(model, Object.assign({ abortEarly: false, context: {
                                state: this.state,
                                props: this.props,
                            } }, this.props.configure));
                    }
                    catch (validationErrors) {
                        const _errors = validationErrors;
                        if (_errors.path === undefined) {
                            _errors.inner.forEach(error => {
                                errors = Object.assign({}, errors, { [error.path]: [...(errors[error.path] || []),
                                        ...error.errors.map(message => ({ message }))] });
                            });
                        }
                        else {
                            this.context = _errors.errors;
                        }
                        isValid = false;
                    }
                }
                else {
                    const preErrors = validator.validate(model, {
                        state: this.state,
                        props: this.props,
                    });
                    for (const key of Object.keys(preErrors)) {
                        if (preErrors[key].length > 0) {
                            isValid = false;
                            errors = preErrors;
                            break;
                        }
                    }
                }
            }
            if (scopeValidator) {
                const preScope = scopeValidator.validate(model, {
                    state: this.state,
                    props: this.props,
                });
                if (preScope.length > 0) {
                    isValid = false;
                    scope = preScope;
                }
            }
            const result = { errors, scope, isValid };
            if (!shallowequal(result, this.prevErrors)) {
                this.prevErrors = result;
                return result;
            }
            else {
                return this.prevErrors;
            }
        };
    }
    render() {
        return (React.createElement(Form_1.Consumer, null, context => React.createElement(exports.Provider, { value: this.validate(context) }, this.props.children)));
    }
}
Validation.defaultProps = {
    isValid: true,
    configure: {},
};
exports.Validation = Validation;
var _a;
