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
const deepEqual = require("deep-equal");
const React = require("react");
const field_1 = require("../helpers/field");
const form_1 = require("../helpers/form");
const tools_1 = require("../tools");
const Transform_1 = require("./Transform");
const Validation_1 = require("./Validation");
/**
 * Default [[Form]] configuration
 */
exports.defaultConfiguration = {
    submitting: {
        preventDefault: true
    }
};
const defaultStorage = {
    values: {},
    state: {},
    config: exports.defaultConfiguration,
    validation: {
        errors: {},
        isValid: true
    },
    isChanged: false,
    isSubmitting: false
};
_a = React.createContext({
    storage: defaultStorage,
    handleReset: () => ({}),
    handleChange: () => ({}),
    mountField: () => ({}),
    unMountField: () => ({})
}), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
/**
 * Form component controlls [[Field]]s and passes [[FormContext]]
 */
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.fields = [];
        this.mountField = (value) => {
            this.fields.push(value);
        };
        this.unMountField = (value) => {
            const id = this.fields.indexOf(value);
            if (id > -1) {
                this.fields.splice(id, 1);
            }
        };
        /**
         * Handles form submitting and `preventDefault` if
         * `configure.submitting.preventDefault` === true
         * sets all [[Field]]s `isChanged` to `false` and `isVisited` to `true`
         * and fires [[onSubmit]] from props
         */
        this.handleSubmit = (event) => {
            const { onSubmit, config } = this.props;
            if (event && config && config.submitting.preventDefault) {
                event.preventDefault();
            }
            this.validate();
            if (this.storage.validation.isValid) {
                this.updateState({
                    isChanged: false,
                    isFocus: false,
                    isVisited: false
                });
                this.storage.isChanged = false;
            }
            else {
                this.updateState({
                    isChanged: true,
                    isVisited: true
                });
            }
            this.invokeFieldsUpdate();
            if (onSubmit) {
                onSubmit(event)(this.storage.values, this.storage.validation.isValid);
            }
        };
        /**
         * Reset form to [[initValues]]
         */
        this.handleReset = (event) => {
            const { onReset, values, initValues } = this.props;
            if (onReset) {
                onReset(event);
            }
            if (!values) {
                this.resetToInital();
                this.invokeFieldsUpdate();
            }
        };
        /**
         * Update [[Field]] state with new `value` and sets form `isChanged` to `true`
         */
        this.handleChange = (event) => {
            if (field_1.isDiffEqual(event, this.storage)) {
                return;
            }
            const updatedFields = [];
            const prevValues = this.storage.values;
            this.storage.values = Object.assign({}, prevValues);
            this.storage.state = Object.assign({}, this.storage.state);
            const valuesProxy = tools_1.autoCreateProxy(this.storage.values);
            if (this.transform.current) {
                const transforms = this.transform.current.transform([event][Symbol.iterator](), this.storage);
                const stateProxy = tools_1.autoCreateProxy(this.storage.state);
                tools_1.forEachElement(transforms, ({ selector, value, state }) => {
                    let newState = null;
                    if (value !== undefined) {
                        if (state === undefined) {
                            const prevValue = tools_1.fromProxy(valuesProxy, selector);
                            const prevState = tools_1.fromProxy(stateProxy, selector, {});
                            newState = Object.assign({}, prevState, { isChanged: prevState.isChanged === true
                                    || prevValue !== undefined && !field_1.isValueEqual(value, prevValue) });
                        }
                        tools_1.setPathValue(value, selector, this.storage.values);
                    }
                    if (state !== undefined && state !== null) {
                        const prevValue = tools_1.fromProxy(valuesProxy, selector);
                        const prevState = tools_1.fromProxy(stateProxy, selector, {});
                        newState = Object.assign({}, prevState, state, { isChanged: prevState.isChanged === true
                                || state.isChanged === true
                                || prevValue !== undefined && value !== undefined && !field_1.isValueEqual(value, prevValue) });
                    }
                    tools_1.setPathValue(newState, selector, this.storage.state);
                    updatedFields.push(selector);
                });
            }
            this.storage.isChanged = true;
            this.validate();
            updatedFields.forEach(selector => {
                this.fields.forEach(field => {
                    if (!field.field.current) {
                        return;
                    }
                    const path1 = tools_1.getPath(selector, this.storage.values);
                    const path2 = tools_1.getPath(field.field.current.props.name, this.storage.values);
                    if (path1 === path2) {
                        field.forceUpdate();
                    }
                });
            });
            // this.invokeFieldsUpdate();
            this.callModelChange(prevValues);
        };
        this.storage = defaultStorage;
        this.storage.state = props.state || props.initState || {};
        this.storage.values = props.values || props.initValues || {};
        this.storage.isChanged = props.isChanged || false;
        this.storage.isSubmitting = props.isSubmitting || false;
        this.transform = React.createRef();
        this.validation = React.createRef();
    }
    get getStorage() {
        return this.storage;
    }
    get getFields() {
        return this.fields;
    }
    /**
     * [[Form]] update [[storage]]
     */
    shouldComponentUpdate(nextProps) {
        const { values, config, isReset, isChanged, isSubmitting } = nextProps;
        this.storage.config = config;
        if (isReset) {
            this.resetToInital(values);
        }
        else if (values !== undefined) {
            const { isChanged: isValuesChanged, model: newValues } = form_1.setModelValues(values, this.storage.values);
            this.storage.values = newValues;
            this.storage.isChanged = this.storage.isChanged || isValuesChanged;
        }
        this.storage.validation = {
            errors: {},
            isValid: true
        };
        this.storage.isChanged = isChanged !== undefined ? isChanged : this.storage.isChanged;
        this.storage.isSubmitting = isSubmitting !== undefined ? isSubmitting : this.storage.isSubmitting;
        return true;
    }
    render() {
        const _a = this.props, { componentId, actions, values, state, initValues, initState, children, config, isReset, isChanged, isSubmitting, onModelChange, onSubmit, onReset } = _a, rest = __rest(_a, ["componentId", "actions", "values", "state", "initValues", "initState", "children", "config", "isReset", "isChanged", "isSubmitting", "onModelChange", "onSubmit", "onReset"]);
        const context = {
            storage: this.storage,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
            mountField: this.mountField,
            unMountField: this.unMountField
        };
        return (React.createElement(exports.Provider, { value: context },
            React.createElement("form", Object.assign({ onSubmit: this.handleSubmit, onReset: this.handleReset }, rest),
                React.createElement(Transform_1.Transform, { ref: this.transform },
                    React.createElement(Validation_1.Validation, { ref: this.validation }, children)))));
    }
    componentDidMount() {
        this.fields.forEach(field => {
            if (field.field.current) {
                field.field.current.mountValue();
            }
        });
    }
    // componentDidCatch(error, info) {
    //     console.log(error, info);
    // }
    validate() {
        if (this.validation.current) {
            this.storage.validation = {
                errors: {},
                isValid: true
            };
            this.validation.current.smartValidate(this.storage);
        }
    }
    updateState(state) {
        this.storage.state = form_1.updateFieldsState(state, this.storage.state, this.fields.map(f => f.props.name));
    }
    resetToInital(initalValues) {
        const { storage, fields, props: { initValues } } = this;
        storage.values = initalValues || initValues || {};
        this.updateState({
            isChanged: false,
            isFocus: false,
            isVisited: false
        });
        this.storage.validation = {
            errors: {},
            isValid: true
        };
        storage.isChanged = false;
        storage.isSubmitting = false;
    }
    /**
     * Transform `model` to `values` and call `onModelChange`
     */
    callModelChange(prevModel) {
        if (!this.props.onModelChange) {
            return;
        }
        const { values } = this.storage;
        if (!deepEqual(values, prevModel)) {
            this.props.onModelChange(values, prevModel);
        }
    }
    invokeFieldsUpdate() {
        this.fields.forEach(field => field.forceUpdate());
    }
}
Form.defaultProps = {
    config: exports.defaultConfiguration
};
exports.Form = Form;
var _a;
//# sourceMappingURL=Form.js.map