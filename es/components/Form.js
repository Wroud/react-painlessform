var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from "react";
import shallowequal from "shallowequal";
export const { Provider, Consumer } = React.createContext();
const EmptyModel = {};
export class Form extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = (event) => {
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
                return;
            }
        };
        this.handleChange = (field, value) => {
            if (this.props.values) {
                const { model } = this.state;
                if (model[field] === value) {
                    return;
                }
                const nextModel = Object.assign({}, model, { [field]: value });
                this.props.onModelChange(this.state.model, nextModel);
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
        const _a = this.props, { values, onModelChange } = _a, rest = __rest(_a, ["values", "onModelChange"]);
        for (const key of Object.keys(rest)) {
            if (rest[key] !== nextProps[key]) {
                return true;
            }
        }
        const _b = this.state, { model, isSubmitting, handleChange } = _b, stateRest = __rest(_b, ["model", "isSubmitting", "handleChange"]);
        for (const key of Object.keys(stateRest)) {
            if (stateRest[key] !== nextState[key]) {
                return true;
            }
        }
        if (!shallowequal(model, nextState.model)
            || isSubmitting !== nextState.isSubmitting) {
            return true;
        }
        return false;
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.onModelChange && !shallowequal(this.state.model, prevState.model)) {
            this.props.onModelChange(prevState.model, this.state.model);
        }
    }
    render() {
        const _a = this.props, { componentId, children, onModelChange, onSubmit } = _a, rest = __rest(_a, ["componentId", "children", "onModelChange", "onSubmit"]);
        return (React.createElement(Provider, { value: this.state },
            React.createElement("form", Object.assign({ onSubmit: this.handleSubmit }, rest), children)));
    }
}
