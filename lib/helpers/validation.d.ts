import * as Yup from "yup";
import { IValidationErrors } from "../interfaces/validation";
export declare function yupErrors<T>(error: Yup.ValidationError): IterableIterator<IValidationErrors<T>>;
export declare function yupValidator<T>(schema: Yup.Schema<T>, model: T, context: any, configure?: Yup.ValidateOptions): Iterable<IValidationErrors<T>>;
