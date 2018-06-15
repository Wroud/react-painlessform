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
const formFactory_1 = require("../helpers/formFactory");
const tools_1 = require("../tools");
/**
 * Default [[Form]] configuration
 */
exports.defaultConfiguration = {
    htmlPrimitives: true,
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
    isChanged: false
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
        /**
         * Handles form submitting and `preventDefault` if
         * `configure.submitting.preventDefault` === true
         * sets all [[Field]]s `isChanged` to `false` and `isVisited` to `true`
         * and fires [[onSubmit]] from props
         */
        this.handleSubmit = (event) => {
            const { onSubmit, config } = this.props;
            if (event && config.submitting.preventDefault) {
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
            this.smartUpdate();
            if (onSubmit) {
                onSubmit(event)(this.storage.values, this.storage.validation.isValid);
            }
        };
        /**
         * Reset form to [[initValues]]
         */
        this.handleReset = (event) => {
            const { onReset, values } = this.props;
            if (onReset) {
                onReset(event);
            }
            if (!values) {
                this.resetToInital();
                this.smartUpdate();
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
            if (this.transform.current) {
                const transforms = this.transform.current.transform([event][Symbol.iterator](), this.storage);
                tools_1.forEachElement(transforms, ({ selector, value, state }) => {
                    let newState = null;
                    if (state !== undefined && state !== null) {
                        const prevValue = selector.getValue(this.storage.values);
                        const prevState = selector.getValue(this.storage.state, {});
                        newState = Object.assign({}, prevState, state, { isChanged: prevState.isChanged === true
                                || state.isChanged === true
                                || prevValue !== undefined && value !== undefined && !field_1.isValueEqual(value, prevValue) });
                    }
                    if (value !== undefined) {
                        if (state === undefined) {
                            const prevValue = selector.getValue(this.storage.values);
                            const prevState = selector.getValue(this.storage.state, {});
                            newState = Object.assign({}, prevState, { isChanged: prevState.isChanged === true
                                    || prevValue !== undefined && !field_1.isValueEqual(value, prevValue) });
                        }
                        selector.setValueImmutable(this.storage.values, value);
                    }
                    selector.setValueImmutable(this.storage.state, newState);
                    updatedFields.push(selector);
                });
            }
            this.storage.isChanged = true;
            this.validate();
            if (this.subscribers.current) {
                this.subscribers.current.smartUpdate(updatedFields);
            }
            this.callModelChange(prevValues);
        };
        this.mountField = (value) => {
            this.fields.push(value);
        };
        this.unMountField = (value) => {
            const id = this.fields.indexOf(value);
            if (id > -1) {
                this.fields.splice(id, 1);
            }
        };
        this.storage = defaultStorage;
        this.storage.state = props.state || props.initState || {};
        this.storage.values = props.values || props.initValues || {};
        this.storage.isChanged = props.isChanged || false;
        this.transform = React.createRef();
        this.validation = React.createRef();
        this.subscribers = React.createRef();
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
        const { values, state, config, isReset, isChanged } = nextProps;
        this.storage.config = config;
        if (isReset) {
            this.resetToInital(values, state);
        }
        else {
            if (values !== undefined) {
                const { isChanged: isValuesChanged, model: newValues } = form_1.mergeModels(values, this.storage.values);
                this.storage.values = newValues;
                this.storage.isChanged = this.storage.isChanged || isValuesChanged;
            }
            if (state !== undefined) {
                const { isChanged: isStateChanged, model: newState } = form_1.mergeModels(state, this.storage.state);
                this.storage.state = newState;
                this.storage.isChanged = this.storage.isChanged || isStateChanged;
            }
        }
        this.storage.validation = {
            errors: {},
            isValid: true
        };
        this.storage.isChanged = isChanged !== undefined ? isChanged : this.storage.isChanged;
        return true;
    }
    render() {
        const _a = this.props, { componentId, actions, values, state, initValues, initState, children, config, isReset, isChanged, isSubmitting, onModelChange, onSubmit, onReset, errors, isValid, validator, configure, transformer } = _a, rest = __rest(_a, ["componentId", "actions", "values", "state", "initValues", "initState", "children", "config", "isReset", "isChanged", "isSubmitting", "onModelChange", "onSubmit", "onReset", "errors", "isValid", "validator", "configure", "transformer"]);
        const context = {
            storage: this.storage,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
            mountField: this.mountField,
            unMountField: this.unMountField
        };
        const { Subscribe, Transform, Validation } = formFactory_1.createFormFactory();
        return (React.createElement(exports.Provider, { value: context },
            React.createElement(Subscribe, { ref: this.subscribers },
                React.createElement("form", Object.assign({ onSubmit: this.handleSubmit, onReset: this.handleReset }, rest),
                    React.createElement(Transform, Object.assign({ ref: this.transform, transformer: transformer }, rest),
                        React.createElement(Validation, Object.assign({ ref: this.validation, validator: validator, isValid: isValid, errors: errors, configure: configure }, rest), children))))));
    }
    componentDidMount() {
        this.fields.forEach(field => {
            if (field.field.current) {
                field.field.current.mountValue();
            }
        });
    }
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
        this.storage.state = form_1.updateFieldsState(state, this.storage.state, this.fields
            .filter(f => f.field.current !== null)
            .map(f => f.path));
    }
    resetToInital(initalValues, initalState) {
        const { storage, props: { initValues, initState } } = this;
        storage.values = initalValues || initValues || {};
        if (initalState || initState) {
            storage.state = initalState || initState;
        }
        else {
            this.updateState({
                isChanged: false,
                isFocus: false,
                isVisited: false
            });
        }
        this.storage.validation = {
            errors: {},
            isValid: true
        };
        storage.isChanged = false;
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
    smartUpdate() {
        this.storage.validation = {
            errors: {},
            isValid: true
        };
        this.forceUpdate();
    }
}
Form.defaultProps = {
    config: exports.defaultConfiguration
};
exports.Form = Form;
var _a;
//# sourceMappingURL=Form.js.map