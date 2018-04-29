import { IValidationContext } from "../components/Validation";
import { FormErrors } from "../FormValidator";
import { mergeFormErrors } from "../tools";

export function mergeValidations<T>(validation: IValidationContext<T>, context: IValidationContext<T>): IValidationContext<T> {
    return {
        isValid: !(!context.isValid || !validation.isValid),
        errors: mergeFormErrors(context.errors, validation.errors) as FormErrors<T>,
        scope: [...context.scope, ...validation.scope],
    };
}
