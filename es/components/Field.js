"use strict";
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
const React = require("react");
const shallowequal = require("shallowequal");
const formFactory_1 = require("../helpers/formFactory");
const tools_1 = require("../tools");
const defaultProps = {
    validationErrors: [],
    validationScope: [],
    rest: {},
    formState: {
        model: {},
    },
};
_a = React.createContext(defaultProps), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class FieldClass extends React.Component {
    constructor() {
        super(...arguments);
        this.onClick = () => {
            this.setVisited();
            if (this.props.onClick) {
                this.props.onClick();
            }
        };
        this.handleChange = (value) => {
            let nextValue;
            if (tools_1.isChangeEvent(value)) {
                const { type, checked, value: targetValue } = value.target;
                nextValue = type === "checkbox" ? checked : targetValue;
            }
            else {
                nextValue = value;
            }
            this.update({
                value: nextValue,
                isVisited: true,
                isChanged: true,
            });
        };
        this.update = (nextValue) => {
            const { formState: { handleChange }, name, value, isChanged, isVisited, onChange, } = this.props;
            const updValue = Object.assign({ value,
                isChanged,
                isVisited }, (nextValue || {}));
            handleChange(name, updValue);
            if (onChange) {
                onChange(name, updValue);
            }
        };
    }
    render() {
        const _a = this.props, { value, children } = _a, rest = __rest(_a, ["value", "children"]);
        const context = Object.assign({}, rest, { value: value === undefined ? "" : value, onChange: this.handleChange, onClick: this.onClick });
        return (children && typeof children === "function"
            ? children(context)
            : React.createElement(exports.Provider, { value: context }, children));
    }
    componentDidMount() {
        if (this.props.value === undefined) {
            this.update({
                value: "",
                isVisited: false,
                isChanged: false,
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.value === undefined) {
            this.update({
                value: "",
                isVisited: false,
                isChanged: false,
            });
        }
    }
    shouldComponentUpdate(nextProps) {
        const { name: nextName, value: nextValue, isVisited: nextIsVisited, isChanged: nextIsChanged, isValid: nextIsValid, validationErrors: nextErrors, validationScope: nextScope, rest: nextRest, } = nextProps;
        const { name, value, isVisited, isChanged, isValid, validationErrors, validationScope, rest, } = this.props;
        if (!tools_1.isArrayEqual(validationErrors.map(error => error.message), nextErrors.map(error => error.message))
            || !tools_1.isArrayEqual(validationScope.map(error => error.message), nextScope.map(error => error.message))
            || !shallowequal(nextRest, rest)
            || !shallowequal({
                name: nextName,
                value: nextValue,
                isVisited: nextIsChanged,
                isChanged: nextIsValid,
                isValid: nextIsVisited,
            }, { name, value, isVisited, isChanged, isValid })) {
            return true;
        }
        return false;
    }
    setVisited() {
        if (!this.props.isVisited) {
            this.update({ isVisited: true });
        }
    }
}
FieldClass.defaultProps = defaultProps;
exports.FieldClass = FieldClass;
class Field extends React.Component {
    render() {
        const { FormContext, ValidationContext, TransformContext } = formFactory_1.createFormFactory();
        return (React.createElement(FormContext, null, formState => (React.createElement(ValidationContext, null, validation => (React.createElement(TransformContext, null, handleChange => {
            const _a = this.props, { name, children, subscribe, onClick, onChange } = _a, rest = __rest(_a, ["name", "children", "subscribe", "onClick", "onChange"]);
            let fullRest = rest;
            if (subscribe !== undefined) {
                fullRest = Object.assign({}, fullRest, subscribe(formState));
            }
            let formContext = formState;
            if (handleChange !== undefined) {
                formContext = Object.assign({}, formContext, { handleChange });
            }
            const modelValue = formState.model[name];
            const value = modelValue === undefined ? undefined : modelValue.value;
            const isChanged = modelValue === undefined ? false : modelValue.isChanged;
            const isVisited = modelValue === undefined ? false : modelValue.isVisited;
            const isValid = (validation.errors[name] === undefined
                || validation.errors[name].length === 0)
                && (validation.scope === undefined || validation.scope.length === 0);
            const _Field = FieldClass;
            return (React.createElement(_Field, { name: name, value: value, validationErrors: validation.errors[name], validationScope: validation.scope, formState: formContext, isChanged: isChanged, isVisited: isVisited, isValid: isValid, onClick: onClick, onChange: onChange, children: children, rest: fullRest }));
        }))))));
    }
}
exports.Field = Field;
var _a;
