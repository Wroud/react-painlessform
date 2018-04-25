"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = require("../components/Field");
var Form_1 = require("../components/Form");
var Transform_1 = require("../components/Transform");
var Validation_1 = require("../components/Validation");
function createFormFactory() {
    return {
        Form: Form_1.Form,
        Field: Field_1.Field,
        Transform: Transform_1.Transform,
        Validation: Validation_1.Validation,
        FormContext: Form_1.Consumer,
        FieldContext: Field_1.Consumer,
        TransformContext: Transform_1.Consumer,
        ValidationContext: Validation_1.Consumer,
    };
}
exports.createFormFactory = createFormFactory;
//# sourceMappingURL=formFactory.js.map