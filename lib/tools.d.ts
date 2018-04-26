/// <reference types="react" />
import * as React from "react";
import * as Yup from "yup";
import { FormErrors } from "./FormValidator";
export declare function isArrayEqual(array0: any[], array1: any[]): boolean;
export declare function mergeFormErrors(one: FormErrors<any>, two: FormErrors<any>): FormErrors<any>;
export declare function isChangeEvent(object: any): object is React.ChangeEvent<HTMLInputElement>;
export declare function isYup(object: any): object is Yup.Schema<any>;
