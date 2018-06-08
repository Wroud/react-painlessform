import { IFieldState } from "./field";
import { IValidationState } from "./validation";
export interface IFormStorage<T extends object> {
    values: T;
    state: FieldsState<T>;
    validation: IValidationState<T>;
    isChanged: boolean;
    isSubmitting: boolean;
    config: IFormConfiguration;
}
export declare type CastStateValue<T> = T extends object ? FieldsState<T> : IFieldState;
export declare type CastStateArray<T> = T extends object ? Array<FieldsState<T>> : IFieldState;
export declare type CastValueState<T> = T extends Array<infer S> ? CastStateArray<S> : CastStateValue<T>;
export declare type FieldsState<T> = {
    [P in keyof T]: CastValueState<P>;
};
export interface IFormConfiguration {
    submitting: {
        preventDefault: boolean;
    };
}
