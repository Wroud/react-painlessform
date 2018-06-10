import * as Yup from "yup";
import { IValidationErrors, IValidationPropGetters, ValidationProps } from "../interfaces/validation";
export declare function getProps<T extends IValidationPropGetters>(getters: T): ValidationProps<T>;
export declare function yupErrors<T>(error: Yup.ValidationError): IterableIterator<IValidationErrors>;
export declare function yupValidator<T>(schema: Yup.Schema<T>, model: T, context: any, configure?: Yup.ValidateOptions): Iterable<IValidationErrors>;
