"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var FieldValidator = (function () {
    function FieldValidator(name, validator, map) {
        var _this = this;
        this.validate = function (data, state, props) {
            if (_this.map(data) === undefined) {
                return {};
            }
            return _a = {},
                _a[_this.name] = _this.validator.validate(_this.map(data), state, props),
                _a;
            var _a;
        };
        this.name = name;
        this.map = map || (function (data) { return data[name]; });
        this.validator = validator;
    }
    return FieldValidator;
}());
exports.FieldValidator = FieldValidator;
function createRawFormValidator(validator) {
    return { validate: validator };
}
exports.createRawFormValidator = createRawFormValidator;
function createFieldValidator(name, validator, map) {
    return new FieldValidator(name, validator, map);
}
exports.createFieldValidator = createFieldValidator;
function createFieldValidatorFactory(name, validator, map) {
    return function () { return new FieldValidator(name, validator, map); };
}
exports.createFieldValidatorFactory = createFieldValidatorFactory;
function combineFieldValidators() {
    var validators = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        validators[_i] = arguments[_i];
    }
    return {
        validate: function (model, state, props) {
            var errors = {};
            validators.forEach(function (validator) {
                errors = tools_1.mergeFormErrors(errors, validator.validate(model, state, props));
            });
            return errors;
        },
    };
}
exports.combineFieldValidators = combineFieldValidators;
//# sourceMappingURL=FieldValidator.js.map