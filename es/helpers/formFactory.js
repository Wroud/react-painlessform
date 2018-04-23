"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Field_1 = require("../components/Field");
const Form_1 = require("../components/Form");
function createFormFactory(defaultValues) {
    const Fields = {};
    Object.keys(defaultValues).forEach(key => {
        Fields[key] = Field_1.Field;
    });
    return {
        Form: Form_1.Form,
        Fields,
    };
}
exports.createFormFactory = createFormFactory;
