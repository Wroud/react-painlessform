import { IValidationContext } from "../components/Validation";
import { IValidationPropGetters, ValidationProps } from "../interfaces/validation";
export declare function mergeValidations<T>(validation: IValidationContext<T>, context: IValidationContext<T>): IValidationContext<T>;
export declare function getProps<T extends IValidationPropGetters>(getters: T): ValidationProps<T>;
