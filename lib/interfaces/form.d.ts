import { IFieldState } from "./field";
import { IValidationState } from "./validation";
export interface IFormStorage<T extends object> {
    values: T;
    state: FieldsState<T>;
    validation: IValidationState<T>;
    isChanged: boolean;
    isSubmitting: boolean;
    config?: IFormConfiguration;
}
export declare type FieldsState<T> = {
    [P in keyof T]: T[P] extends Array<infer S> ? S extends object ? Array<FieldsState<S>> : IFieldState[] : T[P] extends object ? FieldsState<T[P]> : IFieldState;
};
export interface IFormConfiguration {
    submitting: {
        preventDefault: boolean;
    };
}
