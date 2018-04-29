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
var formFactory_1 = require("../helpers/formFactory");
var tools_1 = require("../tools");
/**
 * Default [[FieldClass]] props and FieldContext value
 */
var defaultProps = {
    validationErrors: [],
    validationScope: [],
    rest: {},
    formState: {
        model: {},
    },
};
exports.Provider = (_a = React.createContext(defaultProps), _a.Provider), exports.Consumer = _a.Consumer;
/**
 * FieldClass React component accepts [[ClassProps]] as props
 */
var FieldClass = /** @class */ (function (_super) {
    __extends(FieldClass, _super);
    function FieldClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Call [[setVisited]] and [[onClick]]
         */
        _this.onClick = function () {
            _this.setVisited();
            if (_this.props.onClick) {
                _this.props.onClick();
            }
        };
        /**
         * Get `value` from `React.ChangeEvent<HTMLInputElement>` or pass as it is
         * set `isVisited` & `isChanged` to `true`
         */
        _this.handleChange = function (value) {
            var nextValue;
            if (tools_1.isChangeEvent(value)) {
                var _a = value.target, type = _a.type, checked = _a.checked, targetValue = _a.value;
                nextValue = type === "checkbox" ? checked : targetValue;
                // const name = !target.name ? target.id : target.name;
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
        /**
         * Call [[Form]] `handleChange` with `name` & new `value`
         * and call [[onChange]] from props
         */
        _this.update = function (nextValue) {
            var _a = _this.props, handleChange = _a.formState.handleChange, name = _a.name, value = _a.value, isChanged = _a.isChanged, isVisited = _a.isVisited, onChange = _a.onChange;
            var updValue = __assign({ value: value,
                isChanged: isChanged,
                isVisited: isVisited }, (nextValue || {}));
            handleChange(name, updValue);
            if (onChange) {
                onChange(name, updValue);
            }
        };
        return _this;
    }
    FieldClass.prototype.render = function () {
        var _a = this.props, value = _a.value, children = _a.children, rest = __rest(_a, ["value", "children"]);
        var context = __assign({}, rest, { value: value === undefined ? "" : value, onChange: this.handleChange, onClick: this.onClick });
        return (children && typeof children === "function"
            ? children(context)
            : React.createElement(exports.Provider, { value: context }, children));
    };
    /**
     * Mount field to form model if passed `value` is `undefined`
     * with empty string `value`
     */
    FieldClass.prototype.componentDidMount = function () {
        if (this.props.value === undefined) {
            this.update({
                value: "",
                isVisited: false,
                isChanged: false,
            }); // mount field to form model
        }
    };
    /**
     * Remount field to form model if passed `value` is `undefined`
     * with empty string `value`
     */
    FieldClass.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.value === undefined) {
            this.update({
                value: "",
                isVisited: false,
                isChanged: false,
            }); // remount field if it not exists in form model
        }
    };
    /**
     * Field updates only if
     * `value` || `name` || `isVisited` || `isChanged`
     * `isValid` || `validationErrors` || `validationScope`
     * `rest` was changed
     */
    FieldClass.prototype.shouldComponentUpdate = function (nextProps) {
        var _a = nextProps, nextName = _a.name, nextValue = _a.value, nextIsVisited = _a.isVisited, nextIsChanged = _a.isChanged, nextIsValid = _a.isValid, nextErrors = _a.validationErrors, nextScope = _a.validationScope, nextRest = _a.rest;
        var _b = this.props, name = _b.name, value = _b.value, isVisited = _b.isVisited, isChanged = _b.isChanged, isValid = _b.isValid, validationErrors = _b.validationErrors, validationScope = _b.validationScope, rest = _b.rest;
        if (!tools_1.isArrayEqual(validationErrors.map(function (error) { return error.message; }), nextErrors.map(function (error) { return error.message; }))
            || !tools_1.isArrayEqual(validationScope.map(function (error) { return error.message; }), nextScope.map(function (error) { return error.message; }))
            || !shallowequal(nextRest, rest)
            || !shallowequal({
                name: nextName,
                value: nextValue,
                isVisited: nextIsVisited,
                isChanged: nextIsChanged,
                isValid: nextIsValid,
            }, { name: name, value: value, isVisited: isVisited, isChanged: isChanged, isValid: isValid })) {
            return true;
        }
        return false;
    };
    /**
     * Update field `isVisited` to `true`
     */
    FieldClass.prototype.setVisited = function () {
        if (!this.props.isVisited) {
            this.update({ isVisited: true });
        }
    };
    FieldClass.defaultProps = defaultProps;
    return FieldClass;
}(React.Component));
exports.FieldClass = FieldClass;
/**
 * HOC for [[FieldClass]] that connects [[FormContext]], [[ValidationContext]]
 * and [[TransformContext]] and pass it to [[FieldClass]] as props
 */
var Field = /** @class */ (function (_super) {
    __extends(Field, _super);
    function Field() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Field.prototype.render = function () {
        var _this = this;
        var _a = formFactory_1.createFormFactory(), FormContext = _a.FormContext, ValidationContext = _a.ValidationContext, TransformContext = _a.TransformContext;
        return (React.createElement(FormContext, null, function (formState) { return (React.createElement(ValidationContext, null, function (validation) { return (React.createElement(TransformContext, null, function (handleChange) {
            var _a = _this.props, name = _a.name, children = _a.children, subscribe = _a.subscribe, onClick = _a.onClick, onChange = _a.onChange, rest = __rest(_a, ["name", "children", "subscribe", "onClick", "onChange"]);
            var fullRest = rest;
            if (subscribe !== undefined) {
                fullRest = __assign({}, fullRest, subscribe(formState));
            }
            var formContext = formState;
            if (handleChange !== undefined) {
                formContext = __assign({}, formContext, { handleChange: handleChange });
            }
            var modelValue = formState.model[name];
            var value = modelValue === undefined ? undefined : modelValue.value;
            var isChanged = modelValue === undefined ? false : modelValue.isChanged;
            var isVisited = modelValue === undefined ? false : modelValue.isVisited;
            var isValid = (validation.errors[name] === undefined
                || validation.errors[name].length === 0)
                && (validation.scope === undefined || validation.scope.length === 0);
            var _Field = FieldClass;
            return (React.createElement(_Field, { name: name, value: value, validationErrors: validation.errors[name], validationScope: validation.scope, formState: formContext, isChanged: isChanged, isVisited: isVisited, isValid: isValid, onClick: onClick, onChange: onChange, children: children, rest: fullRest }));
        })); })); }));
    };
    return Field;
}(React.Component));
exports.Field = Field;
var _a;
//# sourceMappingURL=Field.js.map