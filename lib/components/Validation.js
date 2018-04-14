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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var shallowequal = require("shallowequal");
var Form_1 = require("./Form");
var NoErrors = {};
exports.Provider = (_a = React.createContext({
    errors: NoErrors,
    isValid: true,
}), _a.Provider), exports.Consumer = _a.Consumer;
var Validation = (function (_super) {
    __extends(Validation, _super);
    function Validation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.prevErrors = {
            errors: NoErrors,
            isValid: true,
        };
        return _this;
    }
    Validation.prototype.validate = function (form) {
        if (this.props.errors) {
            return {
                isValid: this.props.isValid,
                errors: this.props.errors,
            };
        }
        var validator = this.props.validator;
        var errors = NoErrors;
        var isValid = true;
        if (validator && form.model) {
            var preErrors = validator.validate(form.model, {
                state: this.state,
                props: this.props,
            });
            for (var _i = 0, _a = Object.keys(preErrors); _i < _a.length; _i++) {
                var key = _a[_i];
                if (preErrors[key].length > 0) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) {
                errors = preErrors;
            }
        }
        var result = { isValid: isValid, errors: errors };
        if (!shallowequal(result, this.prevErrors)) {
            this.prevErrors = result;
            return result;
        }
        else {
            return this.prevErrors;
        }
    };
    Validation.prototype.render = function () {
        var _this = this;
        return (React.createElement(Form_1.Consumer, null, function (context) { return React.createElement(exports.Provider, { value: _this.validate(context) }, _this.props.children); }));
    };
    return Validation;
}(React.Component));
exports.Validation = Validation;
var _a;
//# sourceMappingURL=Validation.js.map