"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var shallowequal = require("shallowequal");
var form_1 = require("../helpers/form");
var validation_1 = require("../helpers/validation");
var tools_1 = require("../tools");
var Form_1 = require("./Form");
// tslint:disable-next-line:no-object-literal-type-assertion
var NoErrors = {};
var NoScopeErrors = [];
exports.Provider = (_a = React.createContext({
    errors: NoErrors,
    scope: NoScopeErrors,
    isValid: true,
}), _a.Provider), exports.Consumer = _a.Consumer;
/**
 * React Component that accepts [[IValidationProps]] as props
 * That component connect to [[FormContext]] and use passed `validator`, `scopeValidator`
 * to validate [[Form]] model, errors was passed via [[ValidationContext]]
 */
var Validation = /** @class */ (function (_super) {
    __extends(Validation, _super);
    function Validation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cacheErrors = {
            errors: NoErrors,
            scope: NoScopeErrors,
            isValid: true,
        };
        _this.cacheData = {
            model: {},
            props: {},
            state: {},
        };
        _this.validators = [];
        _this.validate = function (model) {
            var validation = {
                errors: NoErrors,
                scope: NoScopeErrors,
                isValid: _this.props.isValid,
            };
            var values = form_1.getValuesFromModel(model);
            validation = validation_1.mergeValidations(_this.validator(values), validation);
            _this.validators.forEach(function (validator) {
                validation = validation_1.mergeValidations(validator.validator(values), validation);
            });
            _this.cacheErrors = validation;
            return validation;
        };
        /**
         * Validation function that accepts [[FormContext]] and validate [[Form]] `model`
         */
        _this.validator = function (model) {
            var errors = NoErrors;
            var scope = NoScopeErrors;
            var isValid = true;
            var props = validation_1.getProps(_this.props);
            var validator = props.validator, scopeValidator = props.scopeValidator;
            if (!model || (!validator && !scopeValidator)) {
                return { errors: errors, scope: scope, isValid: isValid };
            }
            if (props.errors || props.scope) {
                return {
                    errors: props.errors,
                    scope: props.scope,
                    isValid: props.isValid,
                };
            }
            var state = _this.state;
            var data = _this.cacheData;
            if (shallowequal(data.model, model)
                && shallowequal(data.props, props)
                && shallowequal(data.state, state)) {
                return _this.cacheErrors;
            }
            if (validator) {
                if (tools_1.isYup(validator)) {
                    try {
                        validator.validateSync(model, __assign({ abortEarly: false, context: { state: state, props: props } }, props.configure));
                    }
                    catch (validationErrors) {
                        var _errors = validationErrors;
                        if (_errors.path === undefined) {
                            _errors.inner.forEach(function (error) {
                                errors = __assign({}, errors, (_a = {}, _a[error.path] = (errors[error.path] || []).concat(error.errors.map(function (message) { return ({ message: message }); })), _a));
                                var _a;
                            });
                        }
                        else {
                            errors = __assign({}, errors, (_a = {}, _a[_errors.path] = (errors[_errors.path] || []).concat(_errors.errors.map(function (message) { return ({ message: message }); })), _a));
                        }
                        isValid = false;
                    }
                }
                else {
                    var preErrors = validator.validate(model, { state: state, props: props });
                    for (var _i = 0, _b = Object.keys(preErrors); _i < _b.length; _i++) {
                        var key = _b[_i];
                        if (preErrors[key].length > 0) {
                            isValid = false;
                            errors = preErrors;
                            break;
                        }
                    }
                }
            }
            if (scopeValidator) {
                var preScope = scopeValidator.validate(model, { state: state, props: props });
                if (preScope.length > 0) {
                    isValid = false;
                    scope = preScope;
                }
            }
            // tslint:disable-next-line:no-object-literal-type-assertion
            var result = { errors: errors, scope: scope, isValid: isValid };
            _this.cacheData = { model: model, props: props, state: state };
            _this.cacheErrors = result;
            return result;
            var _a;
        };
        _this.mountValidation = function (value) {
            _this.validators.push(value);
        };
        _this.unMountValidation = function (value) {
            var id = _this.validators.indexOf(value);
            if (id > -1) {
                _this.validators.slice(id, 1);
            }
        };
        return _this;
    }
    Validation.prototype.render = function () {
        var _this = this;
        return (React.createElement(exports.Consumer, null, function (validationContext) { return (React.createElement(Form_1.Consumer, null, function (formContext) {
            _this._context = validationContext.mountValidation
                ? validationContext
                : undefined;
            var context = __assign({}, (_this._context ? validationContext : _this.validate(formContext.model)), { mountValidation: _this.mountValidation, unMountValidation: _this.unMountValidation });
            return React.createElement(exports.Provider, { value: context }, _this.props.children);
        })); }));
    };
    Validation.prototype.componentDidMount = function () {
        if (this._context) {
            this._context.mountValidation(this);
        }
    };
    Validation.prototype.componentWillUnmount = function () {
        if (this._context) {
            this._context.unMountValidation(this);
        }
    };
    Validation.defaultProps = {
        isValid: true,
        configure: {},
    };
    return Validation;
}(React.Component));
exports.Validation = Validation;
var _a;
//# sourceMappingURL=Validation.js.map