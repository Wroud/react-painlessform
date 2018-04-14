"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormValidator = (function () {
    function FormValidator(validator) {
        var _this = this;
        this.validate = function (data, state, props) {
            return _this.validator.validate(data, state, props);
        };
        this.validator = validator;
    }
    return FormValidator;
}());
exports.FormValidator = FormValidator;
exports.createFormValidator = function (validator) {
    return new FormValidator(validator);
};
//# sourceMappingURL=FormValidator.js.map