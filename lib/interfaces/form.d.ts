import { IFieldState } from "./field";
export interface IFormConfiguration {
    submitting: {
        preventDefault: boolean;
    };
    validation: any;
}
export declare type FormModel<T> = {
    [P in keyof T]: IFieldState<T[P]>;
};
