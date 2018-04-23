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
var shallowequal = require("shallowequal");
var form_1 = require("../helpers/form");
exports.defaultConfiguration = {
    submitting: {
        preventDefault: true,
    },
    validation: {},
};
exports.Provider = (_a = React.createContext(), _a.Provider), exports.Consumer = _a.Consumer;
var EmptyModel = {};
var Form = (function (_super) {
    __extends(Form, _super);
    function Form(props) {
        var _this = _super.call(this, props) || this;
        _this.handleSubmit = function (event) {
            if (event && _this.props.configure.submitting.preventDefault) {
                event.preventDefault();
            }
            var onSubmit = _this.props.onSubmit;
            _this.setState(function (state) { return ({
                model: form_1.updateModelFields({
                    isChanged: false,
                    isVisited: true,
                }, state.model),
            }); });
            if (onSubmit) {
                onSubmit(event)(form_1.getValuesFromModel(_this.state.model));
            }
        };
        _this.handleReset = function () {
            var onReset = _this.props.onReset;
            if (onReset) {
                onReset();
            }
            if (!_this.props.values) {
                _this.setState(function (_a) {
                    var model = _a.model;
                    var nextModel = form_1.resetModel(model);
                    return {
                        model: nextModel,
                    };
                });
            }
        };
        _this.handleChange = function (field, value) {
            _this.setState(function (prev, props) {
                if (prev.model[field] && shallowequal(prev.model[field], value)) {
                    return null;
                }
                var nextModel = __assign({}, prev.model, (_a = {}, _a[field] = __assign({}, value), _a));
                return {
                    model: nextModel,
                };
                var _a;
            });
        };
        _this.state = {
            model: EmptyModel,
            isChanged: false,
            isSubmitting: false,
            handleReset: _this.handleReset,
            handleChange: _this.handleChange,
        };
        return _this;
    }
    Form.getDerivedStateFromProps = function (props, state) {
        var values = props.values, configure = props.configure;
        var nextState = null;
        var model = props.isReset ? form_1.resetModel(state.model) : state.model;
        nextState = {
            model: values ? form_1.updateModel(values, model) : model,
            configure: configure || exports.defaultConfiguration,
        };
        return nextState;
    };
    Form.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var _a = this.state, model = _a.model, rest = __rest(_a, ["model"]);
        var nextModel = nextState.model, nextRest = __rest(nextState, ["model"]);
        var _b = this.props, children = _b.children, props = __rest(_b, ["children"]);
        var _ = nextProps.children, nnextProps = __rest(nextProps, ["children"]);
        if (!shallowequal(props, nnextProps)
            || !shallowequal(model, nextModel)
            || !shallowequal(rest, nextRest)) {
            return true;
        }
        return false;
    };
    Form.prototype.componentDidUpdate = function (prevProps, prevState) {
        this.callModelChange(this.state.model, prevState.model);
    };
    Form.prototype.render = function () {
        var _a = this.props, componentId = _a.componentId, values = _a.values, actions = _a.actions, children = _a.children, configure = _a.configure, isReset = _a.isReset, isChanged = _a.isChanged, isSubmitting = _a.isSubmitting, onModelReset = _a.onModelReset, onModelChange = _a.onModelChange, onSubmit = _a.onSubmit, rest = __rest(_a, ["componentId", "values", "actions", "children", "configure", "isReset", "isChanged", "isSubmitting", "onModelReset", "onModelChange", "onSubmit"]);
        return (React.createElement(exports.Provider, { value: this.state },
            React.createElement("form", __assign({ onSubmit: this.handleSubmit }, rest), children)));
    };
    Form.prototype.callModelChange = function (model, prevModel) {
        if (!this.props.onModelChange) {
            return;
        }
        var values = form_1.getValuesFromModel(model);
        var prevValues = form_1.getValuesFromModel(prevModel);
        if (!shallowequal(values, prevValues)) {
            this.props.onModelChange(values, prevValues);
        }
    };
    Form.defaultProps = {
        configure: exports.defaultConfiguration,
    };
    return Form;
}(React.Component));
exports.Form = Form;
var _a;
//# sourceMappingURL=Form.js.map