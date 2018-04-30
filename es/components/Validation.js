"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const shallowequal = require("shallowequal");
const form_1 = require("../helpers/form");
const validation_1 = require("../helpers/validation");
const tools_1 = require("../tools");
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
        this.validators = [];
        this.validate = (model) => {
            let validation = {
                errors: NoErrors,
                scope: NoScopeErrors,
                isValid: this.props.isValid,
            };
            const values = form_1.getValuesFromModel(model);
            validation = validation_1.mergeValidations(this.validator(values), validation);
            this.validators.forEach(validator => {
                validation = validation_1.mergeValidations(validator.validator(values), validation);
            });
            return validation;
        };
        this.validator = (model) => {
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
            if (!model) {
                return { errors, scope, isValid };
            }
            if (validator) {
                if (tools_1.isYup(validator)) {
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
                            errors = Object.assign({}, errors, { [_errors.path]: [...(errors[_errors.path] || []),
                                    ..._errors.errors.map(message => ({ message }))] });
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
        this.mountValidation = (value) => {
            this.validators.push(value);
        };
        this.unMountValidation = (value) => {
            const id = this.validators.indexOf(value);
            if (id > -1) {
                this.validators.slice(id, 1);
            }
        };
    }
    render() {
        return (React.createElement(exports.Consumer, null, validationContext => (React.createElement(Form_1.Consumer, null, formContext => {
            this._context = validationContext.mountValidation
                ? validationContext
                : undefined;
            const context = Object.assign({}, (this._context ? validationContext : this.validate(formContext.model)), { mountValidation: this.mountValidation, unMountValidation: this.unMountValidation });
            return React.createElement(exports.Provider, { value: context }, this.props.children);
        }))));
    }
    componentDidMount() {
        if (this._context) {
            this._context.mountValidation(this);
        }
    }
    componentWillUnmount() {
        if (this._context) {
            this._context.unMountValidation(this);
        }
    }
}
Validation.defaultProps = {
    isValid: true,
    configure: {},
};
exports.Validation = Validation;
var _a;
