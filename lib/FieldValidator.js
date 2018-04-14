"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FieldValidator = (function () {
    function FieldValidator(name, validator, map) {
        this.name = name;
        this.map = map || (function (data) { return data[name]; });
        this.validator = validator;
        this.validate = this.validate.bind(this);
    }
    FieldValidator.prototype.validate = function (data, meta) {
        if (this.map(data) === undefined) {
            return {};
        }
        return _a = {},
            _a[this.name] = this.validator.validate(this.map(data), meta),
            _a;
        var _a;
    };
    return FieldValidator;
}());
exports.FieldValidator = FieldValidator;
function createFieldValidator(name, validator, map) {
    return new FieldValidator(name, validator, map);
}
exports.createFieldValidator = createFieldValidator;
//# sourceMappingURL=FieldValidator.js.map