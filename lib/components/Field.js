"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var tools_1 = require("../tools");
var Form_1 = require("./Form");
var Validation_1 = require("./Validation");
exports.Provider = (_a = React.createContext(), _a.Provider), exports.Consumer = _a.Consumer;
var FieldClass = (function (_super) {
    __extends(FieldClass, _super);
    function FieldClass(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = function () {
            if (!_this.state.isVisited) {
                _this.setState({
                    isVisited: true,
                });
            }
            if (_this.props.onClick) {
                _this.props.onClick();
            }
        };
        _this.handleChange = function (value) {
            if (value !== undefined
                && value.target !== undefined
                && value.target.value !== undefined) {
                var target = value.target;
                value = target.type === "checkbox" ? target.checked : target.value;
            }
            if (_this.props.onChange) {
                _this.props.onChange(_this.props.name, value);
            }
            _this.setState({ value: value });
            _this.update(value);
        };
        _this.update = function (value) {
            var formState = _this.props.formState;
            _this.props.formState.handleChange(_this.props.name, value);
        };
        _this.state = {
            value: "",
            name: "",
            isValid: true,
            isVisited: false,
            onClick: _this.onClick,
            onChange: _this.handleChange,
        };
        return _this;
    }
    FieldClass.getDerivedStateFromProps = function (_a, _b) {
        var nextErrors = _a.validationErrors, nextValue = _a.value, name = _a.name;
        var prevValue = _b.value, prevValidationErrors = _b.validationErrors;
        var value = prevValue;
        var validationErrors = prevValidationErrors;
        if (prevValue !== nextValue) {
            value = nextValue === undefined ? "" : nextValue;
        }
        if (!tools_1.isArrayEqual(prevValidationErrors, nextErrors)) {
            validationErrors = nextErrors;
        }
        return {
            value: value,
            name: name,
            validationErrors: validationErrors,
            isValid: validationErrors === undefined || validationErrors.length === 0,
        };
    };
    FieldClass.prototype.render = function () {
        var children = this.props.children;
        var rChildren = children
            && typeof children === "function"
            ? children(this.state)
            : children;
        return (React.createElement(exports.Provider, { value: this.state }, rChildren));
    };
    FieldClass.prototype.componentDidMount = function () {
        this.update(this.state.value);
    };
    FieldClass.prototype.componentDidUpdate = function (prevProps, prevState) {
    };
    FieldClass.prototype.shouldComponentUpdate = function (nextProps, nextState) {
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
    };
    return FieldClass;
}(React.Component));
exports.FieldClass = FieldClass;
function withFormState(Component) {
    return function FieldComponent(props) {
        return (React.createElement(Form_1.Consumer, null, function (formState) { return (React.createElement(Validation_1.Consumer, null, function (validation) { return (React.createElement(Component, __assign({}, props, { value: formState.model[props.name], validationErrors: validation.errors[props.name], formState: formState }))); })); }));
    };
}
exports.withFormState = withFormState;
exports.Field = withFormState(FieldClass);
var _a;
//# sourceMappingURL=Field.js.map