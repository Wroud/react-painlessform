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
    validation: {},
};
_a = React.createContext(), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
const EmptyModel = {};
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = (event) => {
            if (event && this.props.configure.submitting.preventDefault) {
                event.preventDefault();
            }
            const { onSubmit } = this.props;
            this.setState(state => ({
                model: form_1.updateModelFields({
                    isChanged: false,
                    isVisited: true,
                }, state.model),
            }));
            if (onSubmit) {
                onSubmit(event)(form_1.getValuesFromModel(this.state.model));
            }
        };
        this.handleReset = () => {
            const { onReset } = this.props;
            if (onReset) {
                onReset();
            }
            if (!this.props.values) {
                this.setState(({ model }) => {
                    const nextModel = form_1.resetModel(model);
                    return {
                        model: nextModel,
                    };
                });
            }
        };
        this.handleChange = (field, value) => {
            this.setState((prev, props) => {
                if (prev.model[field] && shallowequal(prev.model[field], value)) {
                    return null;
                }
                const nextModel = Object.assign({}, prev.model, { [field]: Object.assign({}, value) });
                return {
                    model: nextModel,
                };
            });
        };
        this.state = {
            model: EmptyModel,
            isChanged: false,
            isSubmitting: false,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
        };
    }
    static getDerivedStateFromProps(props, state) {
        const { values, configure } = props;
        let nextState = null;
        const model = props.isReset ? form_1.resetModel(state.model) : state.model;
        nextState = {
            model: values ? form_1.updateModel(values, state.model) : state.model,
            configure: configure || exports.defaultConfiguration,
        };
        return nextState;
    }
    shouldComponentUpdate(nextProps, nextState) {
        const _a = this.state, { model } = _a, rest = __rest(_a, ["model"]);
        const { model: nextModel } = nextState, nextRest = __rest(nextState, ["model"]);
        if (!shallowequal(this.props, nextProps)
            || !shallowequal(model, nextModel)
            || !shallowequal(rest, nextRest)) {
            return true;
        }
        return false;
    }
    componentDidUpdate(prevProps, prevState) {
        this.callModelChange(this.state.model, prevState.model);
    }
    render() {
        const _a = this.props, { componentId, values, actions, children, configure, isReset, isChanged, isSubmitting, onModelReset, onModelChange, onSubmit } = _a, rest = __rest(_a, ["componentId", "values", "actions", "children", "configure", "isReset", "isChanged", "isSubmitting", "onModelReset", "onModelChange", "onSubmit"]);
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
