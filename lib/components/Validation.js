"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const util_1 = require("util");
const formFactory_1 = require("../helpers/formFactory");
const validation_1 = require("../helpers/validation");
const Path_1 = require("../Path");
const tools_1 = require("../tools");
_a = React.createContext({
    scope: {},
    isValid: true
}), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
/**
 * React Component that accepts [[IValidationProps]] as props
 * That component connect to [[FormContext]] and use passed `validator`, `scopeValidator`
 * to validate [[Form]] model, errors was passed via [[ValidationContext]]
 */
class Validation extends React.Component {
    constructor(props) {
        super(props);
        this.validators = [];
        this.scope = Path_1.Path.root();
        this.validate = ({ values, validation }) => {
            this.validationContext.scope = [];
            this.validationContext.isValid = true;
            const valuesScope = this.scope.getValue(values);
            const errorsCollection = this.validator(valuesScope);
            tools_1.forEachElement(errorsCollection, ({ selector, scope, errors }) => {
                if (util_1.isArray(scope) && scope.length > 0) {
                    this.validationContext.scope.push(...scope);
                    this.validationContext.isValid = false;
                }
                if (util_1.isArray(errors) && errors.length > 0 && selector) {
                    const scopedSelector = this.scope.join(selector);
                    const validationError = scopedSelector.getValue(validation.errors, []);
                    scopedSelector.setValueImmutable(validation.errors, [...validationError, ...errors]);
                    this.validationContext.isValid = false;
                }
            });
            validation.isValid = validation.isValid && this.validationContext.isValid;
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
        this.validationContext = {
            scope: [],
            isValid: true,
            mountValidation: this.mountValidation,
            unMountValidation: this.unMountValidation
        };
    }
    smartValidate(storage) {
        this.validate(storage);
        for (const _validator of this.validators) {
            _validator.smartValidate(storage);
        }
    }
    render() {
        const { FormContext, ValidationContext, ScopeContext } = formFactory_1.createFormFactory();
        return (React.createElement(ScopeContext, null, scope => (React.createElement(ValidationContext, null, validationContext => (React.createElement(FormContext, null, formContext => {
            this._context = validationContext.mountValidation
                ? validationContext
                : undefined;
            this.scope = scope;
            this.validate(formContext.storage);
            return React.createElement(exports.Provider, { value: this.validationContext }, this.props.children);
        }))))));
    }
    componentDidMount() {
        if (this._context && this._context.mountValidation) {
            this._context.mountValidation(this);
        }
    }
    componentWillUnmount() {
        if (this._context && this._context.unMountValidation) {
            this._context.unMountValidation(this);
        }
    }
    /**
     * Validation function that accepts [[FormContext]] and validate [[Form]] `model`
     */
    *validator(model) {
        const props = this.props;
        const state = this.state;
        const { errors, validator, configure: config } = props;
        if (!model || !validator) {
            return;
        }
        if (errors) {
            yield* errors;
        }
        if (tools_1.isYup(validator)) {
            yield* validation_1.yupValidator(validator, model, { state, props }, config);
        }
        else {
            yield* validator.validate(model, { state, props, config: config });
        }
    }
}
Validation.defaultProps = {
    isValid: true,
    configure: {}
};
exports.Validation = Validation;
var _a;
//# sourceMappingURL=Validation.js.map