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
            if (value !== undefined
                && value.target !== undefined
                && value.target.value !== undefined) {
                const target = value.target;
                value = target.type === "checkbox" ? target.checked : target.value;
            }
            if (this.props.onChange) {
                this.props.onChange(this.props.name, value);
            }
            this.setState({ value });
            this.update(value);
        };
        this.update = (value) => {
            const { formState } = this.props;
            this.props.formState.handleChange(this.props.name, value);
        };
        this.state = {
            value: "",
            name: "",
            isValid: true,
            isVisited: false,
            onClick: this.onClick,
            onChange: this.handleChange,
        };
    }
    static getDerivedStateFromProps({ validationErrors: nextErrors, value: nextValue, name, }, { value: prevValue, validationErrors: prevValidationErrors, }) {
        let value = prevValue;
        let validationErrors = prevValidationErrors;
        if (prevValue !== nextValue) {
            value = nextValue === undefined ? "" : nextValue;
        }
        if (!tools_1.isArrayEqual(prevValidationErrors, nextErrors)) {
            validationErrors = nextErrors;
        }
        return {
            value,
            name,
            validationErrors,
            isValid: validationErrors === undefined || validationErrors.length === 0,
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
        if (this.props.name !== nextProps.name
            || !tools_1.isArrayEqual(this.props.validationErrors, nextProps.validationErrors)
            || this.props.onChange !== nextProps.onChange
            || this.props.name !== nextProps.name
            || this.props.value !== nextProps.value
            || this.state.isValid !== nextState.isValid
            || this.state.isVisited !== nextState.isVisited) {
            return true;
        }
        return false;
    }
}
exports.FieldClass = FieldClass;
function withFormState(Component) {
    return function FieldComponent(props) {
        return (React.createElement(Form_1.Consumer, null, formState => (React.createElement(Validation_1.Consumer, null, validation => (React.createElement(Component, Object.assign({}, props, { value: formState.model[props.name], validationErrors: validation.errors[props.name], formState: formState })))))));
    };
}
exports.withFormState = withFormState;
exports.Field = withFormState(FieldClass);
var _a;
