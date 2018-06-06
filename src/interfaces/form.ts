import { FieldClass } from "../components/Field";
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

export type CastStateValue<T> = T extends object ? FieldsState<T> : IFieldState;
export type CastStateArray<T> = T extends object ? Array<FieldsState<T>> : IFieldState;
export type CastValueState<T> = T extends Array<infer S> ? CastStateArray<S> : CastStateValue<T>;

export type FieldsState<T> = {
    [P in keyof T]: CastValueState<P>;
};
interface IP {
    a: number;
    b: string;
    c: {
        a: string,
        b: number
    };
}
type p = FieldsState<IP>;

export interface IFormConfiguration {
    submitting: {
        preventDefault: boolean;
    };
}
