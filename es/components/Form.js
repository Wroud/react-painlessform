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
_a = React.createContext(), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
const EmptyModel = {};
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = (event) => {
            if (event) {
                event.preventDefault();
            }
            const { onSubmit } = this.props;
            if (onSubmit) {
                onSubmit(event);
            }
        };
        this.handleReset = () => {
            const { onReset } = this.props;
            if (onReset) {
                onReset();
            }
            if (!this.props.values) {
                this.setState({
                    model: EmptyModel,
                });
            }
        };
        this.handleChange = (field, value) => {
            if (this.props.values) {
                const { model } = this.state;
                if (model[field] === value) {
                    return;
                }
                const nextModel = Object.assign({}, model, { [field]: value });
                this.props.onModelChange(nextModel, this.state.model);
                return;
            }
            this.setState((prev, props) => {
                if (prev.model[field] === value) {
                    return null;
                }
                const nextModel = Object.assign({}, prev.model, { [field]: value });
                return {
                    model: nextModel,
                };
            });
        };
        this.state = {
            model: EmptyModel,
            isSubmitting: false,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
        };
    }
    static getDerivedStateFromProps(props, state) {
        const { values } = props;
        let nextState = null;
        nextState = {
            model: values ? values : state.model,
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
        if (this.props.onModelChange
            && !shallowequal(this.state.model, prevState.model)) {
            this.props.onModelChange(this.state.model, prevState.model);
        }
    }
    render() {
        const _a = this.props, { componentId, children, onModelChange, onSubmit, values, actions } = _a, rest = __rest(_a, ["componentId", "children", "onModelChange", "onSubmit", "values", "actions"]);
        return (React.createElement(exports.Provider, { value: this.state },
            React.createElement("form", Object.assign({ onSubmit: this.handleSubmit }, rest), children)));
    }
}
exports.Form = Form;
var _a;
