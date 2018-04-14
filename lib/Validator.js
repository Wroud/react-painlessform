"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var ArrayValidator = (function () {
    function ArrayValidator(name, validator) {
        var _this = this;
        this.validate = function (data, state, props) {
            var errors = _this.validator(data, state, props);
            if (Array.isArray(errors)) {
                return errors;
            }
            else {
                return [errors];
            }
        };
        this.name = name;
        this.validator = validator;
    }
    return ArrayValidator;
}());
exports.ArrayValidator = ArrayValidator;
exports.createValidator = function (name, validator) {
    return new ArrayValidator(name, validator);
};
exports.createValidatorFactory = function (name, validator) {
    return function () { return new ArrayValidator(name, validator); };
};
function combineValidators() {
    var validators = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        validators[_i] = arguments[_i];
    }
    return {
        validate: tools_1.concat.apply(void 0, validators.map(function (validator) { return validator.validate; })),
    };
}
exports.combineValidators = combineValidators;
//# sourceMappingURL=Validator.js.map