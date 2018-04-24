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
const tools_1 = require("../tools");
const Form_1 = require("./Form");
const Validation_1 = require("./Validation");
_a = React.createContext(), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
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
            if (value.target !== undefined) {
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
            const { formState: { handleChange }, name, value, isChanged, isVisited, } = this.props;
            const updValue = Object.assign({ value,
                isChanged,
                isVisited }, (nextValue || {}));
            handleChange(name, updValue);
            if (this.props.onChange) {
                this.props.onChange(this.props.name, updValue);
            }
        };
    }
    render() {
        const { children } = this.props;
        const props = Object.assign({}, this.props, { onChange: this.handleChange, onClick: this.onClick });
        const rChildren = children
            && typeof children === "function"
            ? children(props)
            : children;
        return (React.createElement(exports.Provider, { value: props }, rChildren));
    }
    componentDidMount() {
        this.update();
    }
    shouldComponentUpdate(nextProps) {
        const _a = nextProps, { validationErrors: nextErrors, validationScope: nextScope, formState: _, children: __ } = _a, nextRest = __rest(_a, ["validationErrors", "validationScope", "formState", "children"]);
        const _b = this.props, { validationErrors, validationScope, formState, children } = _b, rest = __rest(_b, ["validationErrors", "validationScope", "formState", "children"]);
        if (!tools_1.isArrayEqual((validationErrors || []).map(error => error.message), (nextErrors || []).map(error => error.message))
            || !tools_1.isArrayEqual((validationScope || []).map(error => error.message), (nextScope || []).map(error => error.message))
            || !shallowequal(nextRest, rest)) {
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
exports.FieldClass = FieldClass;
class Field extends React.Component {
    render() {
        return (React.createElement(Form_1.Consumer, null, (formState) => (React.createElement(Validation_1.Consumer, null, validation => {
            const props = this.props;
            const modelValue = formState.model[props.name];
            const value = modelValue === undefined ? "" : modelValue.value;
            const isChanged = modelValue === undefined ? false : modelValue.isChanged;
            const isVisited = modelValue === undefined ? false : modelValue.isVisited;
            const isValid = (validation.errors[this.props.name] === undefined
                || validation.errors[this.props.name].length === 0)
                && (validation.scope === undefined || validation.scope.length === 0);
            const _Field = FieldClass;
            return (React.createElement(_Field, Object.assign({}, props, { value: value, validationErrors: validation.errors[this.props.name], validationScope: validation.scope, formState: formState, isChanged: isChanged, isVisited: isVisited, isValid: isValid })));
        }))));
    }
}
exports.Field = Field;
var _a;
