import { IValidationContext } from "../components/Validation";
import { FormErrors } from "../FormValidator";
import { IValidationPropGetters, ValidationProps } from "../interfaces/validation";
import { mergeFormErrors } from "../tools";

export function mergeValidations<T>(validation: IValidationContext<T>, context: IValidationContext<T>): IValidationContext<T> {
    return {
        isValid: !(!context.isValid || !validation.isValid),
        errors: mergeFormErrors(context.errors, validation.errors) as FormErrors<T>,
        scope: [...context.scope, ...validation.scope],
    } as any;
}

export function getProps<T extends IValidationPropGetters>(getters: T): ValidationProps<T> {
    const props: ValidationProps<T> = {} as any;
    Object.keys(getters).forEach(key => {
        props[key] = typeof getters[key] === "function" ? getters[key]() : getters[key];
    });
    return props;
}
