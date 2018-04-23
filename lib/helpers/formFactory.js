"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = require("../components/Field");
var Form_1 = require("../components/Form");
function createFormFactory(defaultValues) {
    var Fields = {};
    Object.keys(defaultValues).forEach(function (key) {
        Fields[key] = Field_1.Field;
    });
    return {
        Form: Form_1.Form,
        Fields: Fields,
    };
}
exports.createFormFactory = createFormFactory;
//# sourceMappingURL=formFactory.js.map