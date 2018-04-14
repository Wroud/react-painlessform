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
var React = require("react");
var shallowequal_1 = require("shallowequal");
exports.Provider = (_a = React.createContext(), _a.Provider), exports.Consumer = _a.Consumer;
var EmptyModel = {};
var Form = (function (_super) {
    __extends(Form, _super);
    function Form(props) {
        var _this = _super.call(this, props) || this;
        _this.handleSubmit = function (event) {
            var onSubmit = _this.props.onSubmit;
            if (onSubmit) {
                onSubmit(event);
            }
        };
        _this.handleReset = function () {
            var onReset = _this.props.onReset;
            if (onReset) {
                onReset();
            }
            if (!_this.props.values) {
                _this.setState({
                    model: EmptyModel,
                });
                return;
            }
        };
        _this.handleChange = function (field, value) {
            if (_this.props.values) {
                var model = _this.state.model;
                if (model[field] === value) {
                    return;
                }
                var nextModel = __assign({}, model, (_a = {}, _a[field] = value, _a));
                _this.props.onModelChange(_this.state.model, nextModel);
                return;
            }
            _this.setState(function (prev, props) {
                if (prev.model[field] === value) {
                    return null;
                }
                var nextModel = __assign({}, prev.model, (_a = {}, _a[field] = value, _a));
                return {
                    model: nextModel,
                };
                var _a;
            });
            var _a;
        };
        _this.state = {
            model: EmptyModel,
            isSubmitting: false,
            handleReset: _this.handleReset,
            handleChange: _this.handleChange,
        };
        return _this;
    }
    Form.getDerivedStateFromProps = function (props, state) {
        var values = props.values;
        var nextState = null;
        nextState = {
            model: values ? values : state.model,
        };
        return nextState;
    };
    Form.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var _a = this.props, values = _a.values, onModelChange = _a.onModelChange, rest = __rest(_a, ["values", "onModelChange"]);
        for (var _i = 0, _b = Object.keys(rest); _i < _b.length; _i++) {
            var key = _b[_i];
            if (rest[key] !== nextProps[key]) {
                return true;
            }
        }
        var _c = this.state, model = _c.model, isSubmitting = _c.isSubmitting, handleChange = _c.handleChange, stateRest = __rest(_c, ["model", "isSubmitting", "handleChange"]);
        for (var _d = 0, _e = Object.keys(stateRest); _d < _e.length; _d++) {
            var key = _e[_d];
            if (stateRest[key] !== nextState[key]) {
                return true;
            }
        }
        if (!shallowequal_1.default(model, nextState.model)
            || isSubmitting !== nextState.isSubmitting) {
            return true;
        }
        return false;
    };
    Form.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.props.onModelChange && !shallowequal_1.default(this.state.model, prevState.model)) {
            this.props.onModelChange(prevState.model, this.state.model);
        }
    };
    Form.prototype.render = function () {
        var _a = this.props, componentId = _a.componentId, children = _a.children, onModelChange = _a.onModelChange, onSubmit = _a.onSubmit, rest = __rest(_a, ["componentId", "children", "onModelChange", "onSubmit"]);
        return (React.createElement(exports.Provider, { value: this.state },
            React.createElement("form", __assign({ onSubmit: this.handleSubmit }, rest), children)));
    };
    return Form;
}(React.Component));
exports.Form = Form;
var _a;
//# sourceMappingURL=Form.js.map