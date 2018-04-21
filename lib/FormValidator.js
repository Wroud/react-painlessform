"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var FormValidator = (function () {
    function FormValidator() {
        var validators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            validators[_i] = arguments[_i];
        }
        var _this = this;
        this.validate = function (data, meta) {
            var errors = {};
            _this.validators.forEach(function (validator) {
                if (validator.validateSync) {
                    try {
                        validator.validateSync(data, {
                            abortEarly: false,
                            context: meta || {},
                        });
                    }
                    catch (_errors) {
                        var __errors = _errors;
                        if (__errors.path === undefined) {
                            __errors.inner.forEach(function (error) {
                                errors = tools_1.mergeFormErrors(errors, (_a = {},
                                    _a[error.path] = error.errors.map(function (message) { return ({ message: message }); }),
                                    _a));
                                var _a;
                            });
                        }
                    }
                }
                else {
                    errors = tools_1.mergeFormErrors(errors, validator.validate(data, meta));
                }
            });
            return errors;
        };
        this.validators = validators;
    }
    return FormValidator;
}());
exports.FormValidator = FormValidator;
function createFormValidator() {
    var validators = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        validators[_i] = arguments[_i];
    }
    return new (FormValidator.bind.apply(FormValidator, [void 0].concat(validators)))();
}
exports.createFormValidator = createFormValidator;
function createRawFormValidator(validator) {
    return { validate: validator };
}
exports.createRawFormValidator = createRawFormValidator;
//# sourceMappingURL=FormValidator.js.map