"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayValidator = /** @class */ (function () {
    function ArrayValidator(name, validators) {
        this.name = name;
        this.validators = validators;
        this.validate = this.validate.bind(this);
    }
    ArrayValidator.prototype.validate = function (data, meta) {
        var errors = [];
        if (data === undefined) {
            return errors;
        }
        this.validators.forEach(function (validator) {
            var validatorErrors = validator(data, meta);
            errors = Array.isArray(validatorErrors)
                ? errors.concat(validatorErrors) : errors.concat([validatorErrors]);
        });
        return errors;
    };
    return ArrayValidator;
}());
exports.ArrayValidator = ArrayValidator;
function createValidator(name) {
    var validator = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        validator[_i - 1] = arguments[_i];
    }
    return new ArrayValidator(name, validator);
}
exports.createValidator = createValidator;
//# sourceMappingURL=ArrayValidator.js.map