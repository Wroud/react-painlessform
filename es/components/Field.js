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
const tools_1 = require("../tools");
const field_1 = require("../helpers/field");
const form_1 = require("../helpers/form");
const formFactory_1 = require("../helpers/formFactory");
const defaultProps = {
    validationErrors: [],
    validationScope: [],
    rest: {},
    form: {
        model: {}
    }
};
_a = React.createContext(defaultProps), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class FieldClass extends React.Component {
    constructor() {
        super(...arguments);
        this.handleFocus = (type) => () => {
            const { value, onBlur, onFocus } = this.props;
            this.update(value, { isVisited: true, isFocus: type });
            if (type && onFocus) {
                onFocus();
            }
            if (!type && onBlur) {
                onBlur();
            }
        };
        this.onClick = () => {
            this.setVisited();
            if (this.props.onClick) {
                this.props.onClick();
            }
        };
        this.handleChange = (value) => {
            const { type } = this.props;
            let nextValue;
            if (tools_1.isSelectChangeEvent(value)) {
                const { checked, value: targetValue, options } = value.target;
                if (!this.props.multiple) {
                    nextValue = targetValue;
                }
                else {
                    nextValue = [];
                    for (let i = 0, l = options.length; i < l; i++) {
                        if (options[i].selected) {
                            nextValue.push(options[i].value);
                        }
                    }
                }
            }
            else if (tools_1.isInputChangeEvent(value)) {
                const { checked, value: targetValue } = value.target;
                nextValue =
                    /number|range/.test(type)
                        ? parseFloat(targetValue)
                        : /checkbox/.test(type)
                            ? checked
                            : targetValue;
            }
            else {
                nextValue = value;
            }
            this.update(nextValue, {
                isVisited: true,
                isChanged: true
            });
        };
        this.update = (nextValue, nextState) => {
            const { type, multiple, forwardedValue, form: { handleChange }, name, value, isChanged, isVisited, isFocus, onChange } = this.props;
            const updValue = field_1.castValue(value, nextValue, forwardedValue, type, multiple);
            const updState = Object.assign({ isVisited, isFocus, isChanged }, nextState);
            handleChange({
                selector: name,
                value: updValue,
                state: updState
            });
            if (onChange) {
                onChange(updValue, updState);
            }
        };
    }
    render() {
        const _a = this.props, { value: _value, forwardedValue, type, multiple, name, children, onBlur, onChange, onClick, onFocus, form } = _a, rest = __rest(_a, ["value", "forwardedValue", "type", "multiple", "name", "children", "onBlur", "onChange", "onClick", "onFocus", "form"]);
        const value = form_1.getValue(_value, type, forwardedValue, multiple);
        const context = Object.assign({}, rest, { inputHook: {
                name: tools_1.getPath(model => name(model), form.storage.values),
                type,
                value: form_1.getInputValue(value, forwardedValue, type, multiple),
                checked: form_1.getInputChecked(value, forwardedValue, type),
                multiple,
                onChange: this.handleChange,
                onClick: this.onClick,
                onFocus: this.handleFocus(true),
                onBlur: this.handleFocus(false)
            } });
        return children && typeof children === "function"
            ? children(context)
            : React.createElement(exports.Provider, { value: context, children: children });
    }
    componentDidMount() {
        this.mountValue();
    }
    componentWillUnmount() {
        this.update(undefined, {});
    }
    componentDidUpdate(prevProps) {
        this.mountValue();
    }
    mountValue() {
        const { value, type, forwardedValue, multiple } = this.props;
        if (value === undefined) {
            this.update(form_1.getValue(undefined, type, forwardedValue, multiple), {
                isVisited: false,
                isChanged: false,
                isFocus: false
            });
        }
    }
    setVisited() {
        if (!this.props.isVisited) {
            this.update(this.props.value, { isVisited: true });
        }
    }
}
FieldClass.defaultProps = defaultProps;
exports.FieldClass = FieldClass;
class Field extends React.Component {
    constructor() {
        super(...arguments);
        this.field = React.createRef();
    }
    render() {
        const { FormContext, ValidationContext } = formFactory_1.createFormFactory();
        const _a = this.props, { value: forwardedValue, name, type, multiple, children, subscribe, onClick, onChange, onFocus, onBlur } = _a, rest = __rest(_a, ["value", "name", "type", "multiple", "children", "subscribe", "onClick", "onChange", "onFocus", "onBlur"]);
        return (React.createElement(FormContext, null, formContext => (React.createElement(ValidationContext, null, ({ validation }) => {
            this.formContext = formContext;
            let fullRest = rest;
            if (subscribe !== undefined) {
                fullRest = Object.assign({}, fullRest, subscribe(formContext.storage));
            }
            const value = tools_1.fromProxy(tools_1.autoCreateProxy(formContext.storage.values), name);
            const modelState = tools_1.fromProxy(tools_1.autoCreateProxy(formContext.storage.state), name, {});
            const errors = tools_1.fromProxy(tools_1.autoCreateProxy(validation.errors), name, []);
            const isChanged = modelState.isChanged === true;
            const isVisited = modelState.isVisited === true;
            const isFocus = modelState.isFocus === true;
            const isValid = errors.length === 0;
            const _Field = FieldClass;
            return (React.createElement(_Field, { name: name, type: type, multiple: multiple, value: value, forwardedValue: forwardedValue, validationErrors: errors, validationScope: validation.scope, form: formContext, isChanged: isChanged, isVisited: isVisited, isValid: isValid, isFocus: isFocus, onClick: onClick, onChange: onChange, onBlur: onBlur, onFocus: onFocus, children: children, rest: fullRest, ref: this.field }));
        }))));
    }
    componentDidMount() {
        if (this.formContext) {
            this.formContext.mountField(this);
        }
    }
    componentWillUnmount() {
        if (this.formContext) {
            this.formContext.unMountField(this);
        }
    }
}
Field.defaultProps = { type: "text" };
exports.Field = Field;
var _a;
