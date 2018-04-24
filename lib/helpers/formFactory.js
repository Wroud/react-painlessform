"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = require("../components/Field");
var Form_1 = require("../components/Form");
function createFormFactory(defaultValues) {
    return {
        Form: Form_1.Form,
        Field: Field_1.Field,
    };
}
exports.createFormFactory = createFormFactory;
//# sourceMappingURL=formFactory.js.map