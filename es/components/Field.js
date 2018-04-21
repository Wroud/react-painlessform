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
    constructor(props) {
        super(props);
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
            this.setVisited();
            if (this.props.onChange) {
                this.props.onChange(this.props.name, nextValue);
            }
            if (this.props.value === undefined) {
                this.setState({ value: nextValue });
            }
            this.update(nextValue);
        };
        this.update = value => {
            const { formState, name } = this.props;
            this.inputValue = value;
            formState.handleChange(name, value);
        };
        this.inputValue = "";
        this.state = {
            value: "",
            name: "",
            isValid: true,
            isVisited: false,
            onClick: this.onClick,
            onChange: this.handleChange,
        };
    }
    static getDerivedStateFromProps({ validationErrors: nextErrors, validationScope: nextValidationScope, value: nextValue, name, }, { isVisited, value: prevValue, validationErrors: prevValidationErrors, validationScope: prevValidationScope, }) {
        let value = prevValue;
        let validationErrors = prevValidationErrors;
        let validationScope = prevValidationScope;
        if (value !== nextValue) {
            value = nextValue === undefined ? "" : nextValue;
        }
        if (!tools_1.isArrayEqual((validationErrors || []).map(error => error.message), (nextErrors || []).map(error => error.message))) {
            validationErrors = nextErrors;
        }
        if (!tools_1.isArrayEqual((validationScope || []).map(error => error.message), (nextValidationScope || []).map(error => error.message))) {
            validationScope = nextValidationScope;
        }
        return {
            value,
            name,
            validationErrors,
            validationScope,
            isVisited: nextValue !== prevValue
                && (nextValue === undefined || nextValue === "")
                ? false
                : isVisited,
            isValid: (validationErrors === undefined || validationErrors.length === 0)
                && (validationScope === undefined || validationScope.length === 0),
        };
    }
    render() {
        const { children } = this.props;
        const rChildren = children
            && typeof children === "function"
            ? children(this.state)
            : children;
        return (React.createElement(exports.Provider, { value: this.state }, rChildren));
    }
    componentDidMount() {
        this.update(this.state.value);
    }
    componentDidUpdate(prevProps, prevState) {
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { onChange: _, value: __ } = nextProps, nextRest = __rest(nextProps, ["onChange", "value"]);
        const _a = this.props, { onChange, value: propsValue } = _a, rest = __rest(_a, ["onChange", "value"]);
        const { value, name, isVisited, isValid, validationErrors, validationScope } = this.state;
        if (onChange !== nextProps.onChange
            || propsValue !== nextProps.value
            || name !== nextState.name
            || value !== nextState.value
            || isVisited !== nextState.isVisited
            || isValid !== nextState.isValid
            || !tools_1.isArrayEqual((validationErrors || []).map(error => error.message), (nextState.validationErrors || []).map(error => error.message))
            || !tools_1.isArrayEqual((validationScope || []).map(error => error.message), (nextState.validationScope || []).map(error => error.message))
            || !shallowequal(nextRest, rest)) {
            return true;
        }
        return false;
    }
    setVisited() {
        if (!this.state.isVisited) {
            this.setState({
                isVisited: true,
            });
        }
    }
}
exports.FieldClass = FieldClass;
function withFormState(Component) {
    return function FieldComponent(props) {
        return (React.createElement(Form_1.Consumer, null, formState => (React.createElement(Validation_1.Consumer, null, validation => (React.createElement(Component, Object.assign({}, props, { value: formState.model[props.name], validationErrors: validation.errors[props.name], validationScope: validation.scope, formState: formState })))))));
    };
}
exports.withFormState = withFormState;
exports.Field = withFormState(FieldClass);
var _a;
