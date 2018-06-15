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
const Path_1 = require("../Path");
const tools_1 = require("../tools");
const field_1 = require("../helpers/field");
const formFactory_1 = require("../helpers/formFactory");
const Unset = undefined;
_a = React.createContext(undefined), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
/**
 * FieldClass React component accepts [[ClassProps]] as props
 */
class FieldClass extends React.Component {
    constructor() {
        super(...arguments);
        this.handleFocus = (type) => () => {
            const { onBlur, onFocus } = this.props;
            this.update(Unset, { isVisited: true, isFocus: type });
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
            if (!this.props.isVisited) {
                this.update(Unset, { isVisited: true });
            }
            if (this.props.onClick) {
                this.props.onClick();
            }
        };
        /**
         * Get `value` from `React.ChangeEvent<HTMLInputElement | HTMLSelectElement>`
         * set `isVisited` & `isChanged` to `true`
         */
        this.handleHTMLInputChange = (value, state) => {
            const { type } = this.props;
            let nextValue;
            if (tools_1.isSelectChangeEvent(value)) {
                const { value: targetValue, options } = value.target;
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
            this.update(nextValue, state !== undefined
                ? state
                : {
                    isVisited: true,
                    isChanged: true
                });
        };
        this.handleChange = (value, state) => {
            this.update(value, state !== undefined
                ? state
                : {
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
            const updValue = nextValue !== null && nextValue !== Unset
                ? field_1.castValue(value, nextValue, type, forwardedValue, multiple)
                : nextValue;
            const updState = nextState !== null && nextState !== Unset
                ? Object.assign({ isVisited, isFocus, isChanged }, nextState)
                : nextState;
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
        const _a = this.props, { value: fieldValue, type, name, forwardedValue, defaultValue, multiple, children, form } = _a, rest = __rest(_a, ["value", "type", "name", "forwardedValue", "defaultValue", "multiple", "children", "form"]);
        let inputHook = {};
        if (form.storage.config.htmlPrimitives) {
            const value = field_1.getDefaultValue(fieldValue || defaultValue, type, multiple);
            inputHook = Object.assign({ name: name.getPath() }, field_1.getInputState(value, type, forwardedValue, multiple), { onChange: this.handleHTMLInputChange, onClick: this.onClick, onFocus: this.handleFocus(true), onBlur: this.handleFocus(false) });
        }
        const context = Object.assign({}, rest, { name, value: fieldValue, defaultValue,
            forwardedValue,
            type,
            multiple,
            form,
            inputHook, onClick: this.onClick, onFocus: this.handleFocus(true), onBlur: this.handleFocus(false), onChange: this.handleChange });
        return children && typeof children === "function"
            ? children(context)
            : React.createElement(exports.Provider, { value: context, children: children });
    }
    componentDidUpdate() { this.mountValue(); }
    componentDidMount() { this.mountValue(); }
    componentWillUnmount() { this.update(null, null); }
    mountValue() {
        const { value, type, multiple, defaultValue } = this.props;
        if (value === Unset) {
            this.update(field_1.getDefaultValue(defaultValue || Unset, type, multiple), {
                isVisited: false,
                isChanged: false,
                isFocus: false
            });
        }
    }
}
exports.FieldClass = FieldClass;
/**
 * HOC for [[FieldClass]] that connects [[FormContext]], [[ValidationContext]]
 * and [[TransformContext]] and pass it to [[FieldClass]] as props
 */
class Field extends React.Component {
    constructor() {
        super(...arguments);
        this.field = React.createRef();
        this.subscriptions = [];
    }
    render() {
        const { FormContext, SubscribeContext, ValidationContext, ScopeContext } = formFactory_1.createFormFactory();
        const _a = this.props, { value: forwardedValue, defaultValue, name, type, multiple, children, subscribe, onClick, onChange, onFocus, onBlur } = _a, rest = __rest(_a, ["value", "defaultValue", "name", "type", "multiple", "children", "subscribe", "onClick", "onChange", "onFocus", "onBlur"]);
        return (React.createElement(SubscribeContext, null, subscribeContext => (React.createElement(ScopeContext, null, scope => (React.createElement(FormContext, null, formContext => (React.createElement(ValidationContext, null, ({ scope: validationScope }) => {
            this.formContext = formContext;
            this.subscribeContext = subscribeContext;
            let fullRest = rest;
            if (subscribe !== undefined) {
                fullRest = Object.assign({}, fullRest);
                this.subscriptions = [];
                Object.keys(subscribe).forEach(key => {
                    const subscription = scope.join(Path_1.Path.fromSelector(subscribe[key]));
                    this.subscriptions.push(subscription);
                    fullRest[key] = subscription.getValue(formContext.storage.values);
                });
            }
            this.path = scope.join(Path_1.Path.fromSelector(name));
            const value = this.path.getValue(formContext.storage.values);
            const modelState = this.path.getValue(formContext.storage.state, {});
            const errors = this.path.getValue(formContext.storage.validation.errors, []);
            const isChanged = modelState.isChanged === true;
            const isVisited = modelState.isVisited === true;
            const isFocus = modelState.isFocus === true;
            const isValid = errors.length === 0;
            const _Field = FieldClass;
            return (React.createElement(_Field, { name: this.path, type: type, multiple: multiple, value: value, defaultValue: defaultValue, forwardedValue: forwardedValue, validationErrors: errors, validationScope: validationScope, form: formContext, isChanged: isChanged, isVisited: isVisited, isValid: isValid, isFocus: isFocus, onClick: onClick, onChange: onChange, onBlur: onBlur, onFocus: onFocus, children: children, rest: fullRest, ref: this.field }));
        }))))))));
    }
    smartUpdate(events) {
        if (events.some(e => e.includes(this.path))
            || events.some(e => this.subscriptions.some(s => e.includes(s)))) {
            this.forceUpdate();
        }
    }
    componentDidMount() {
        if (this.formContext) {
            this.formContext.mountField(this);
        }
        if (this.subscribeContext) {
            this.subscribeContext.subscribe(this);
        }
    }
    componentWillUnmount() {
        if (this.formContext) {
            this.formContext.unMountField(this);
        }
        if (this.subscribeContext) {
            this.subscribeContext.unSubscribe(this);
        }
    }
}
Field.defaultProps = { type: "text" };
exports.Field = Field;
var _a;
//# sourceMappingURL=Field.js.map