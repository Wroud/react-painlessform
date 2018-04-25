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
var form_1 = require("../helpers/form");
var formFactory_1 = require("../helpers/formFactory");
exports.Provider = (_a = React.createContext(undefined), _a.Provider), exports.Consumer = _a.Consumer;
var Transform = (function (_super) {
    __extends(Transform, _super);
    function Transform() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Transform.prototype.render = function () {
        var _this = this;
        var FormContext = formFactory_1.createFormFactory().FormContext;
        return (React.createElement(FormContext, null, function (_a) {
            var handleTransform = _a.handleTransform, model = _a.model;
            var handleChange = function (field, value) {
                var transformation = _this.props.transformer(field, value, form_1.getValuesFromModel(model));
                var transform = (_a = {},
                    _a[field] = value,
                    _a);
                Object.keys(transformation).forEach(function (key) {
                    transform = __assign({}, transform, (_a = {}, _a[key] = {
                        value: transformation[key],
                        isVisited: true,
                        isChanged: true,
                    }, _a));
                    var _a;
                });
                handleTransform(transform);
                var _a;
            };
            return (React.createElement(exports.Provider, { value: handleChange }, _this.props.children));
        }));
    };
    return Transform;
}(React.Component));
exports.Transform = Transform;
var _a;
//# sourceMappingURL=Transform.js.map