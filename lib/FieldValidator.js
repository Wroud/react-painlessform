"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FieldValidator = /** @class */ (function () {
    function FieldValidator(name, validator, selectValue) {
        this.name = name;
        this.selectValue = selectValue || (function (data) { return data[name]; });
        this.validator = validator;
        this.validate = this.validate.bind(this);
    }
    FieldValidator.prototype.validate = function (data, meta) {
        if (data === undefined || this.selectValue(data) === undefined) {
            // tslint:disable-next-line:no-object-literal-type-assertion
            return {};
        }
        // tslint:disable-next-line:no-object-literal-type-assertion
        return _a = {},
            _a[this.name] = this.validator.validate(this.selectValue(data), meta),
            _a;
        var _a;
    };
    return FieldValidator;
}());
exports.FieldValidator = FieldValidator;
function createFieldValidator(name, validator, seelctValue) {
    return new FieldValidator(name, validator, seelctValue);
}
exports.createFieldValidator = createFieldValidator;
//# sourceMappingURL=FieldValidator.js.map