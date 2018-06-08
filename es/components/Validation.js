"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const util_1 = require("util");
const validation_1 = require("../helpers/validation");
const tools_1 = require("../tools");
const Form_1 = require("./Form");
const NoErrors = {};
const NoScopeErrors = [];
_a = React.createContext({
    validation: {
        errors: NoErrors,
        scope: NoScopeErrors,
        isValid: true
    }
}), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class Validation extends React.Component {
    constructor(props) {
        super(props);
        this.validators = [];
        this.validate = (values) => {
            this.validationState = {
                errors: {},
                scope: [],
                isValid: this.props.isValid
            };
            const errorsCollection = this.validator(values);
            tools_1.forEachElement(errorsCollection, ({ selector, scope, errors }) => {
                if (scope) {
                    this.validationState.scope.push(...scope);
                    this.validationState.isValid = scope.length === 0 && this.validationState.isValid;
                }
                if (util_1.isArray(errors) && selector) {
                    const validationError = tools_1.fromProxy(tools_1.autoCreateProxy(this.validationState.errors), selector, []);
                    tools_1.setPathValue([...validationError, ...errors], selector, this.validationState.errors);
                    this.validationState.isValid = false;
                }
            });
            return this.validationState;
        };
        this.mountValidation = (value) => {
            this.validators.push(value);
        };
        this.unMountValidation = (value) => {
            const id = this.validators.indexOf(value);
            if (id > -1) {
                this.validators.splice(id, 1);
            }
        };
        this.validator = this.validator.bind(this);
    }
    render() {
        return (React.createElement(exports.Consumer, null, validationContext => (React.createElement(Form_1.Consumer, null, formContext => {
            this._context = validationContext.mountValidation
                ? validationContext
                : undefined;
            const context = {
                validation: this._context
                    ? validationContext.validation
                    : this.validate(formContext.storage.values),
                mountValidation: this.mountValidation,
                unMountValidation: this.unMountValidation
            };
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
    *validator(model) {
        const props = validation_1.getProps(this.props);
        const { validator, scopeValidator } = props;
        if (!model || (!validator && !scopeValidator)) {
            return;
        }
        if (this.props.errors) {
            yield* this.props.errors.values();
        }
        else {
            yield* this.generator(validator, scopeValidator, model, props, this.state);
        }
        for (const _validator of this.validators) {
            yield* _validator.validator(model);
        }
    }
    *generator(validator, scopeValidator, model, props, state) {
        if (validator) {
            if (tools_1.isYup(validator)) {
                yield* validation_1.yupValidator(validator, model, { state, props }, props.configure);
            }
            else {
                yield* validator.validate(model, { state, props });
            }
        }
        if (scopeValidator) {
            yield* scopeValidator.validate(model, { state, props });
        }
    }
}
Validation.defaultProps = {
    isValid: true,
    configure: {}
};
exports.Validation = Validation;
var _a;
