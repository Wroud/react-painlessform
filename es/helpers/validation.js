"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("../Path");
function* yupErrors(error) {
    if (error.inner.length > 0) {
        for (const innerError of error.inner) {
            yield* yupErrors(innerError);
        }
    }
    else if (error.errors.length > 0) {
        yield {
            selector: !error.path
                ? undefined
                : Path_1.Path.fromPath(error.path),
            errors: error.errors.map(e => ({ message: e }))
        };
    }
}
exports.yupErrors = yupErrors;
function* yupValidator(schema, model, context, configure) {
    try {
        schema.validateSync(model, Object.assign({ abortEarly: false, context }, (configure || {})));
    }
    catch (validationErrors) {
        yield* yupErrors(validationErrors);
    }
}
exports.yupValidator = yupValidator;
//# sourceMappingURL=validation.js.map