"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Field_1 = require("../components/Field");
const Form_1 = require("../components/Form");
function createFormFactory() {
    return {
        Form: Form_1.Form,
        Field: Field_1.Field,
    };
}
exports.createFormFactory = createFormFactory;
