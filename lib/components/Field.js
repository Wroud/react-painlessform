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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var shallowequal = require("shallowequal");
var tools_1 = require("../tools");
var Form_1 = require("./Form");
var Validation_1 = require("./Validation");
exports.Provider = (_a = React.createContext(), _a.Provider), exports.Consumer = _a.Consumer;
var FieldClass = (function (_super) {
    __extends(FieldClass, _super);
    function FieldClass(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = function () {
            if (!_this.state.isVisited) {
                _this.setState({
                    isVisited: true,
                });
            }
            if (_this.props.onClick) {
                _this.props.onClick();
            }
        };
        _this.handleChange = function (value) {
            var nextValue;
            if (value.target !== undefined) {
                var _a = value.target, type = _a.type, checked = _a.checked, targetValue = _a.value;
                nextValue = type === "checkbox" ? checked : targetValue;
            }
            else {
                nextValue = value;
            }
            if (_this.props.onChange) {
                _this.props.onChange(_this.props.name, nextValue);
            }
            if (_this.props.value === undefined) {
                _this.setState({ value: nextValue });
            }
            _this.update(nextValue);
        };
        _this.update = function (value) {
            var _a = _this.props, formState = _a.formState, name = _a.name;
            _this.inputValue = value;
            formState.handleChange(name, value);
        };
        _this.inputValue = "";
        _this.state = {
            value: "",
            name: "",
            isValid: true,
            isVisited: false,
            onClick: _this.onClick,
            onChange: _this.handleChange,
        };
        return _this;
    }
    FieldClass.getDerivedStateFromProps = function (_a, _b) {
        var nextErrors = _a.validationErrors, nextValidationScope = _a.validationScope, nextValue = _a.value, name = _a.name;
        var isVisited = _b.isVisited, prevValue = _b.value, prevValidationErrors = _b.validationErrors, prevValidationScope = _b.validationScope;
        var value = prevValue;
        var validationErrors = prevValidationErrors;
        var validationScope = prevValidationScope;
        if (value !== nextValue) {
            value = nextValue === undefined ? "" : nextValue;
        }
        if (!tools_1.isArrayEqual(validationErrors, nextErrors)) {
            validationErrors = nextErrors;
        }
        if (!tools_1.isArrayEqual(validationScope, nextValidationScope)) {
            validationScope = nextValidationScope;
        }
        return {
            value: value,
            name: name,
            validationErrors: validationErrors,
            validationScope: validationScope,
            isVisited: nextValue !== prevValue && (nextValue === undefined || nextValue === "") ? false : isVisited,
            isValid: (validationErrors === undefined || validationErrors.length === 0)
                && (validationScope === undefined || validationScope.length === 0),
        };
    };
    FieldClass.prototype.render = function () {
        var children = this.props.children;
        var rChildren = children
            && typeof children === "function"
            ? children(this.state)
            : children;
        return (React.createElement(exports.Provider, { value: this.state }, rChildren));
    };
    FieldClass.prototype.componentDidMount = function () {
        this.update(this.state.value);
    };
    FieldClass.prototype.componentDidUpdate = function (prevProps, prevState) {
    };
    FieldClass.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var _ = nextProps.onChange, __ = nextProps.value, nextRest = __rest(nextProps, ["onChange", "value"]);
        var _a = this.props, onChange = _a.onChange, propsValue = _a.value, rest = __rest(_a, ["onChange", "value"]);
        var _b = this.state, value = _b.value, name = _b.name, isVisited = _b.isVisited, isValid = _b.isValid, validationErrors = _b.validationErrors, validationScope = _b.validationScope;
        if (onChange !== nextProps.onChange
            || propsValue !== nextProps.value
            || name !== nextState.name
            || value !== nextState.value
            || isVisited !== nextState.isVisited
            || isValid !== nextState.isValid
            || !tools_1.isArrayEqual(validationErrors, nextState.validationErrors)
            || !tools_1.isArrayEqual(validationScope, nextState.validationScope)
            || !shallowequal(nextRest, rest)) {
            return true;
        }
        return false;
    };
    return FieldClass;
}(React.Component));
exports.FieldClass = FieldClass;
function withFormState(Component) {
    return function FieldComponent(props) {
        return (React.createElement(Form_1.Consumer, null, function (formState) { return (React.createElement(Validation_1.Consumer, null, function (validation) { return (React.createElement(Component, __assign({}, props, { value: formState.model[props.name], validationErrors: validation.errors[props.name], validationScope: validation.scope, formState: formState }))); })); }));
    };
}
exports.withFormState = withFormState;
exports.Field = withFormState(FieldClass);
var _a;
//# sourceMappingURL=Field.js.map