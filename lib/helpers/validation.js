"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../tools");
function getProps(getters) {
    const props = {};
    Object.keys(getters).forEach(key => {
        props[key] = typeof getters[key] === "function" ? getters[key]() : getters[key];
    });
    return props;
}
exports.getProps = getProps;
function* yupErrors(error) {
    if (error.inner.length > 0) {
        for (const innerError of error.inner) {
            yield* yupErrors(innerError);
        }
    }
    else if (error.errors.length > 0) {
        if (error.path === undefined) {
            yield {
                scope: error.errors.map(e => ({ message: e }))
            };
        }
        else {
            yield {
                selector: model => tools_1.getFromObject(model, error.path),
                errors: error.errors.map(e => ({ message: e }))
            };
        }
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