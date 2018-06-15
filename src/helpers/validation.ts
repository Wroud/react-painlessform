import * as Yup from "yup";
import { IValidationErrors } from "../interfaces/validation";
import { Path } from "../Path";

export function* yupErrors<T>(error: Yup.ValidationError): IterableIterator<IValidationErrors<T>> {
    if (error.inner.length > 0) {
        for (const innerError of error.inner) {
            yield* yupErrors(innerError);
        }
    } else if (error.errors.length > 0) {
        yield {
            selector: !error.path
                ? undefined
                : Path.fromPath(error.path),
            errors: error.errors.map(e => ({ message: e }))
        };
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
