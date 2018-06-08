import * as Yup from "yup";
import { IValidationContext } from "../components/Validation";
import {
    IValidationErrors,
    IValidationPropGetters,
    IValidationState,
    ValidationModel,
    ValidationProps
} from "../interfaces/validation";
import { getFromObject } from "../tools";

export function getProps<T extends IValidationPropGetters>(getters: T): ValidationProps<T> {
    const props = {} as ValidationProps<T>;
    Object.keys(getters).forEach(key => {
        props[key] = typeof getters[key] === "function" ? getters[key]() : getters[key];
    });
    return props;
}

export function* yupErrors<T>(error: Yup.ValidationError): IterableIterator<IValidationErrors> {
    if (error.inner.length > 0) {
        for (const innerError of error.inner) {
            yield* yupErrors(innerError);
        }
    } else if (error.errors.length > 0) {
        if (error.path === undefined) {
            yield {
                scope: error.errors.map(e => ({ message: e }))
            } as IValidationErrors;
        } else {
            yield {
                selector: model => getFromObject(model, error.path),
                errors: error.errors.map(e => ({ message: e }))
            } as IValidationErrors;
        }
    }
}

export function* yupValidator<T>(schema: Yup.Schema<T>, model: T, context: any, configure?: Yup.ValidateOptions) {
    try {
        schema.validateSync(model, {
            abortEarly: false,
            context,
            ...(configure || {})
        });
    } catch (validationErrors) {
        yield* yupErrors<T>(validationErrors as Yup.ValidationError);
    }
}
