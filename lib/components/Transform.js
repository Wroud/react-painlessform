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
exports.Provider = (_a = React.createContext(undefined), _a.Provider), exports.Consumer = _a.Consumer;
/**
 * Transform is React Component that accpts [[ITranformProps]] as props
 * and passes [[transformer]] function as [[TransformContext]]
 */
var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    function Transform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.transformers = [];
        _this.transform = function (values, prevModel) {
            var transformer = _this.props.transformer;
            var model = __assign({}, values);
            if (transformer) {
                model = form_1.mergeModels(transformer(model, prevModel), model);
            }
            _this.transformers.forEach(function (_a) {
                var transform = _a.transform;
                model = form_1.mergeModels(transform(model, prevModel), model);
            });
            return model;
        };
        _this.mountTransform = function (value) {
            _this.transformers.push(value);
        };
        _this.unMountTransform = function (value) {
            var id = _this.transformers.indexOf(value);
            if (id > -1) {
                _this.transformers.slice(id, 1);
            }
        };
        return _this;
    }
    Transform.prototype.render = function () {
        var _this = this;
        var context = {
            mountTransform: this.mountTransform,
            unMountTransform: this.unMountTransform
        };
        return (React.createElement(exports.Consumer, null, function (transform) {
            _this._context = transform;
            return React.createElement(exports.Provider, { value: context }, _this.props.children);
        }));
    };
    Transform.prototype.componentDidMount = function () {
        if (this._context) {
            this._context.mountTransform(this);
        }
    };
    Transform.prototype.componentWillUnmount = function () {
        if (this._context) {
            this._context.unMountTransform(this);
        }
    };
    return Transform;
}(React.Component));
exports.Transform = Transform;
var _a;
//# sourceMappingURL=Transform.js.map