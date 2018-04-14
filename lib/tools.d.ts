import { FormErrors } from "./FormValidator";
export declare function concat<T extends (...args) => any[]>(...units: T[]): T;
export declare function reduce<T extends (...args) => any>(...units: T[]): T;
export declare function isArrayEqual(array0: any[], array1: any[]): boolean;
export declare function mergeFormErrors(one: FormErrors<any>, two: FormErrors<any>): FormErrors<any>;
