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
    function FieldClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onClick = function () {
            _this.setVisited();
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
            _this.update({
                value: nextValue,
                isVisited: true,
                isChanged: true,
            });
        };
        _this.update = function (nextValue) {
            var _a = _this.props, handleChange = _a.formState.handleChange, name = _a.name, value = _a.value, isChanged = _a.isChanged, isVisited = _a.isVisited;
            var updValue = __assign({ value: value,
                isChanged: isChanged,
                isVisited: isVisited }, (nextValue || {}));
            handleChange(name, updValue);
            if (_this.props.onChange) {
                _this.props.onChange(_this.props.name, updValue);
            }
        };
        return _this;
    }
    FieldClass.prototype.render = function () {
        var children = this.props.children;
        var rChildren = children
            && typeof children === "function"
            ? children(this.props)
            : children;
        return (React.createElement(exports.Provider, { value: this.state }, rChildren));
    };
    FieldClass.prototype.componentDidMount = function () {
        this.update();
    };
    FieldClass.prototype.componentDidUpdate = function (prevProps) {
    };
    FieldClass.prototype.shouldComponentUpdate = function (nextProps) {
        var nextErrors = nextProps.validationErrors, nextScope = nextProps.validationScope, _ = nextProps.formState, nextRest = __rest(nextProps, ["validationErrors", "validationScope", "formState"]);
        var _a = this.props, validationErrors = _a.validationErrors, validationScope = _a.validationScope, formState = _a.formState, rest = __rest(_a, ["validationErrors", "validationScope", "formState"]);
        if (!tools_1.isArrayEqual((validationErrors || []).map(function (error) { return error.message; }), (nextErrors || []).map(function (error) { return error.message; }))
            || !tools_1.isArrayEqual((validationScope || []).map(function (error) { return error.message; }), (nextScope || []).map(function (error) { return error.message; }))
            || !shallowequal(nextRest, rest)) {
            return true;
        }
        return false;
    };
    FieldClass.prototype.setVisited = function () {
        if (!this.props.isVisited) {
            this.update({ isVisited: true });
        }
    };
    return FieldClass;
}(React.Component));
exports.FieldClass = FieldClass;
function withFormState(Component) {
    return function FieldComponent(props) {
        return (React.createElement(Form_1.Consumer, null, function (formState) { return (React.createElement(Validation_1.Consumer, null, function (validation) {
            var modelValue = formState.model[props.name];
            var value = modelValue ? "" : modelValue.value;
            var isChanged = modelValue ? false : modelValue.isChanged;
            var isVisited = modelValue ? false : modelValue.isVisited;
            var isValid = (validation.errors[props.name] === undefined
                || validation.errors[props.name].length === 0)
                && (validation.scope === undefined || validation.scope.length === 0);
            return (React.createElement(Component, __assign({}, props, { value: value, validationErrors: validation.errors[props.name], validationScope: validation.scope, formState: formState, isChanged: isChanged, isVisited: isVisited, isValid: isValid })));
        })); }));
    };
}
exports.withFormState = withFormState;
exports.Field = withFormState(FieldClass);
var _a;
//# sourceMappingURL=Field.js.map