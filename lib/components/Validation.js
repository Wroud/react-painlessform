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
var tools_1 = require("../tools");
var Form_1 = require("./Form");
var NoErrors = {};
var NoScopeErrors = [];
exports.Provider = (_a = React.createContext({
    errors: NoErrors,
    scope: NoScopeErrors,
    isValid: true,
}), _a.Provider), exports.Consumer = _a.Consumer;
var Validation = (function (_super) {
    __extends(Validation, _super);
    function Validation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.prevErrors = {
            errors: NoErrors,
            scope: NoScopeErrors,
            isValid: true,
        };
        _this.validate = function (form) {
            if (_this.props.errors || _this.props.scope) {
                return {
                    errors: _this.props.errors,
                    scope: _this.props.scope,
                    isValid: _this.props.isValid,
                };
            }
            var _a = _this.props, validator = _a.validator, scopeValidator = _a.scopeValidator;
            var errors = NoErrors;
            var scope = NoScopeErrors;
            var isValid = true;
            var model = form_1.getValuesFromModel(form.model);
            if (!model) {
                return { errors: errors, scope: scope, isValid: isValid };
            }
            if (validator) {
                if (tools_1.isYup(validator)) {
                    try {
                        validator.validateSync(model, __assign({ abortEarly: false, context: {
                                state: _this.state,
                                props: _this.props,
                            } }, _this.props.configure));
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
                            _this.context = _errors.errors;
                        }
                        isValid = false;
                    }
                }
                else {
                    var preErrors = validator.validate(model, {
                        state: _this.state,
                        props: _this.props,
                    });
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
                var preScope = scopeValidator.validate(model, {
                    state: _this.state,
                    props: _this.props,
                });
                if (preScope.length > 0) {
                    isValid = false;
                    scope = preScope;
                }
            }
            var result = { errors: errors, scope: scope, isValid: isValid };
            if (!shallowequal(result, _this.prevErrors)) {
                _this.prevErrors = result;
                return result;
            }
            else {
                return _this.prevErrors;
            }
        };
        return _this;
    }
    Validation.prototype.render = function () {
        var _this = this;
        return (React.createElement(Form_1.Consumer, null, function (context) { return React.createElement(exports.Provider, { value: _this.validate(context) }, _this.props.children); }));
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