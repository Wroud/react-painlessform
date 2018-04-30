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
const form_1 = require("../helpers/form");
exports.defaultConfiguration = {
    submitting: {
        preventDefault: true,
    },
};
const EmptyModel = {};
_a = React.createContext({
    model: EmptyModel,
    configure: exports.defaultConfiguration,
    handleReset: () => ({}),
    handleChange: () => ({}),
    mountTransform: () => ({}),
    unMountTransform: () => ({}),
}), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.transformers = [];
        this.mountTransform = (value) => {
            this.transformers.push(value);
        };
        this.unMountTransform = (value) => {
            const id = this.transformers.indexOf(value);
            if (id > -1) {
                this.transformers.slice(id, 1);
            }
        };
        this.handleSubmit = (event) => {
            const { onSubmit, configure } = this.props;
            if (event && configure.submitting.preventDefault) {
                event.preventDefault();
            }
            this.setState(state => ({
                model: form_1.updateModelFields({
                    isChanged: false,
                    isVisited: true,
                }, state.model),
                isChanged: false,
            }));
            if (onSubmit) {
                onSubmit(event)(form_1.getValuesFromModel(this.state.model));
            }
        };
        this.handleReset = () => {
            const { onReset, values } = this.props;
            if (onReset) {
                onReset();
            }
            if (!values) {
                this.setState(({ model }, props) => ({
                    model: props.initValues
                        ? form_1.updateModel(props.initValues, EmptyModel)
                        : form_1.resetModel(model),
                    isChanged: false,
                    isSubmitting: false,
                }));
            }
        };
        this.handleChange = (field, value) => {
            this.setState(prev => {
                if (prev.model[field] && shallowequal(prev.model[field], value)) {
                    return null;
                }
                const prevModel = prev.model;
                let model = { [field]: value };
                this.transformers.forEach(transformer => {
                    model = Object.assign({}, model, transformer.transform(model, prevModel));
                });
                return {
                    model: form_1.mergeModels(model, prev.model, ({ value: _value }, { value: prevValue }) => ({ isChanged: _value !== prevValue })),
                    isChanged: true,
                };
            });
        };
        this.state = {
            model: props.initValues ? form_1.updateModel(props.initValues, EmptyModel) : EmptyModel,
            isChanged: false,
            isSubmitting: false,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
            mountTransform: this.mountTransform,
            unMountTransform: this.unMountTransform,
        };
    }
    static getDerivedStateFromProps(props, state) {
        const { values, initValues, configure, isChanged, isSubmitting } = props;
        const model = props.isReset ? form_1.resetModel(state.model) : state.model;
        return {
            model: values
                ? form_1.updateModel(values, model)
                : model,
            configure,
            isChanged: isChanged !== undefined ? isChanged : state.isChanged,
            isSubmitting: isSubmitting !== undefined ? isSubmitting : state.isSubmitting,
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        const _a = this.state, { model } = _a, rest = __rest(_a, ["model"]);
        const { model: nextModel } = nextState, nextRest = __rest(nextState, ["model"]);
        const _b = this.props, { children } = _b, props = __rest(_b, ["children"]);
        const { children: _ } = nextProps, nnextProps = __rest(nextProps, ["children"]);
        const maps = form_1.getMapsFromModel(model);
        const _maps = form_1.getMapsFromModel(nextModel);
        if (!shallowequal(props, nnextProps)
            || !shallowequal(maps.values, _maps.values)
            || !shallowequal(maps.isChanged, _maps.isChanged)
            || !shallowequal(maps.isVisited, _maps.isVisited)
            || !shallowequal(rest, nextRest)) {
            return true;
        }
        return false;
    }
    componentDidUpdate(prevProps, prevState) {
        this.callModelChange(this.state.model, prevState.model);
    }
    render() {
        const _a = this.props, { componentId, values, initValues, actions, children, configure, isReset, isChanged, isSubmitting, onModelReset, onModelChange, onSubmit } = _a, rest = __rest(_a, ["componentId", "values", "initValues", "actions", "children", "configure", "isReset", "isChanged", "isSubmitting", "onModelReset", "onModelChange", "onSubmit"]);
        return (React.createElement(exports.Provider, { value: this.state },
            React.createElement("form", Object.assign({ onSubmit: this.handleSubmit }, rest), children)));
    }
    callModelChange(model, prevModel) {
        if (!this.props.onModelChange) {
            return;
        }
        const values = form_1.getValuesFromModel(model);
        const prevValues = form_1.getValuesFromModel(prevModel);
        if (!shallowequal(values, prevValues)) {
            this.props.onModelChange(values, prevValues);
        }
    }
}
Form.defaultProps = {
    configure: exports.defaultConfiguration,
};
exports.Form = Form;
var _a;
