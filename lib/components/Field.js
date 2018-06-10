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
/**
 * Default [[FieldClass]] props and FieldContext value
 */
const defaultProps = {
    validationErrors: [],
    validationScope: [],
    rest: {},
    form: {
        model: {}
    }
};
_a = React.createContext(defaultProps), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
/**
 * FieldClass React component accepts [[ClassProps]] as props
 */
class FieldClass extends React.Component {
    constructor() {
        super(...arguments);
        this.handleFocus = (type) => () => {
            const { onBlur, onFocus } = this.props;
            this.update(undefined, { isVisited: true, isFocus: type });
            if (type && onFocus) {
                onFocus();
            }
            if (!type && onBlur) {
                onBlur();
            }
        };
        /**
         * Call [[setVisited]] and [[onClick]]
         */
        this.onClick = () => {
            this.setVisited();
            if (this.props.onClick) {
                this.props.onClick();
            }
        };
        /**
         * Get `value` from `React.ChangeEvent<HTMLInputElement>` or pass as it is
         * set `isVisited` & `isChanged` to `true`
         */
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
        /**
         * Call [[Form]] `handleChange` with [[IUpdateEvent]] as argument
         * and call [[onChange]] from props
         */
        this.update = (nextValue, nextState) => {
            const { type, multiple, forwardedValue, form: { handleChange }, name, value, isChanged, isVisited, isFocus, onChange } = this.props;
            const updValue = nextValue === null
                ? null
                : nextValue === undefined
                    ? undefined
                    : field_1.castValue(value, nextValue, forwardedValue, type, multiple);
            const updState = nextState === null
                ? null
                : nextState === undefined
                    ? undefined
                    : Object.assign({ isVisited, isFocus, isChanged }, nextState);
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
                name: tools_1.getPath(name, form.storage.values),
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
    /**
     * Mount field to form model if passed `value` is `undefined`
     * with empty string `value`
     */
    componentDidMount() {
        this.mountValue();
    }
    componentWillUnmount() {
        this.update(null, null);
    }
    /**
     * Remount field to form model (if passed `value` is `undefined`)
     * with empty string `value`
     */
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
            }); // mount field to form model
        }
    }
    /**
     * Update field `isVisited` to `true`
     */
    setVisited() {
        if (!this.props.isVisited) {
            this.update(undefined, { isVisited: true });
        }
    }
}
FieldClass.defaultProps = defaultProps;
exports.FieldClass = FieldClass;
/**
 * HOC for [[FieldClass]] that connects [[FormContext]], [[ValidationContext]]
 * and [[TransformContext]] and pass it to [[FieldClass]] as props
 */
class Field extends React.Component {
    constructor() {
        super(...arguments);
        this.field = React.createRef();
    }
    render() {
        const { FormContext, ValidationContext, ScopeContext } = formFactory_1.createFormFactory();
        const _a = this.props, { value: forwardedValue, name, type, multiple, children, subscribe, onClick, onChange, onFocus, onBlur } = _a, rest = __rest(_a, ["value", "name", "type", "multiple", "children", "subscribe", "onClick", "onChange", "onFocus", "onBlur"]);
        return (React.createElement(ScopeContext, null, scope => (React.createElement(FormContext, null, formContext => (React.createElement(ValidationContext, null, ({ scope: validationScope }) => {
            this.formContext = formContext;
            let fullRest = rest;
            if (subscribe !== undefined) {
                fullRest = Object.assign({}, fullRest, subscribe(formContext.storage));
            }
            const value = tools_1.fromProxy(tools_1.autoCreateProxy(formContext.storage.values), scope(name));
            const modelState = tools_1.fromProxy(tools_1.autoCreateProxy(formContext.storage.state), scope(name), {});
            const errors = tools_1.fromProxy(tools_1.autoCreateProxy(formContext.storage.validation.errors), scope(name), []);
            const isChanged = modelState.isChanged === true;
            const isVisited = modelState.isVisited === true;
            const isFocus = modelState.isFocus === true;
            const isValid = errors.length === 0;
            /*&& (validation.scope === undefined || validation.scope.length === 0)*/
            const _Field = FieldClass;
            return (React.createElement(_Field, { name: scope(name), type: type, multiple: multiple, value: value, forwardedValue: forwardedValue, validationErrors: errors, validationScope: validationScope, form: formContext, isChanged: isChanged, isVisited: isVisited, isValid: isValid, isFocus: isFocus, onClick: onClick, onChange: onChange, onBlur: onBlur, onFocus: onFocus, children: children, rest: fullRest, ref: this.field }));
        }))))));
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
//# sourceMappingURL=Field.js.map