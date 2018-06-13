import * as Yup from "yup";
import {
    IValidationErrors,
    IValidationPropGetters,
    ValidationProps
} from "../interfaces/validation";
import { Path } from "../Path";
import { getFromObject } from "../tools";

export function getProps<T extends IValidationPropGetters>(getters: T): ValidationProps<T> {
    const props = {} as ValidationProps<T>;
    Object.keys(getters).forEach(key => {
        props[key] = typeof getters[key] === "function" ? getters[key]() : getters[key];
    });
    return props;
}

export function* yupErrors<T>(error: Yup.ValidationError): IterableIterator<IValidationErrors<T>> {
    if (error.inner.length > 0) {
        for (const innerError of error.inner) {
            yield* yupErrors(innerError);
        }
    } else if (error.errors.length > 0) {
        if (error.path === undefined) {
            yield {
                scope: error.errors.map(e => ({ message: e }))
            };
        } else {
            yield {
                selector: Path.fromSelector(model => getFromObject(model, error.path)),
                errors: error.errors.map(e => ({ message: e }))
            };
        }
    }
}

export function* yupValidator<T>(schema: Yup.Schema<T>, model: T, context: any, configure?: Yup.ValidateOptions): Iterable<IValidationErrors<T>> {
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
