"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const tools_1 = require("../tools");
const Form_1 = require("./Form");
const Validation_1 = require("./Validation");
_a = React.createContext(), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class FieldClass extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = () => {
            if (!this.state.isVisited) {
                this.setState({
                    isVisited: true,
                });
            }
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
    static getDerivedStateFromProps({ validationErrors: nextErrors, validationScope: nextValidationScope, value: nextValue, name, }, { value: prevValue, validationErrors: prevValidationErrors, validationScope: prevValidationScope, }) {
        let value = prevValue;
        let validationErrors = prevValidationErrors;
        let validationScope = prevValidationScope;
        if (value !== nextValue) {
            value = nextValue === undefined ? "" : nextValue;
        }
        if (!tools_1.isArrayEqual(validationErrors, nextErrors)) {
            validationErrors = nextErrors;
        }
        if (!tools_1.isArrayEqual(validationScope, nextValidationScope)) {
            validationScope = nextValidationScope;
        }
        return {
            value,
            name,
            validationErrors,
            validationScope,
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
        const { onChange, value: propsValue } = this.props;
        const { value, name, isVisited, isValid, validationErrors, validationScope } = this.state;
        if (onChange !== nextProps.onChange
            || propsValue !== nextProps.value
            || name !== nextState.name
            || value !== nextState.value
            || isVisited !== nextState.isVisited
            || isValid !== nextState.isValid
            || !tools_1.isArrayEqual(validationErrors, nextState.validationErrors)
            || !tools_1.isArrayEqual(validationScope, nextState.validationScope)) {
            return true;
        }
        return false;
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
