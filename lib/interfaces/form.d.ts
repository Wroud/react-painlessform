import { IFieldState } from "./field";
export interface IFormConfiguration {
    submitting: {
        preventDefault: boolean;
    };
}
export declare type FormModel<T> = {
    [P in keyof T]: IFieldState<T[P]>;
};
export declare type BooleanMap<T> = {
    [P in keyof T]: boolean;
};
export interface IModelMap<T> {
    values: T;
    isVisited: BooleanMap<T>;
    isChanged: BooleanMap<T>;
}
