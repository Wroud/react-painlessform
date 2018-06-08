/// <reference types="react" />
import * as React from "react";
import * as Yup from "yup";
export declare function deepExtend(destination: any, source: any): void;
export declare function isArrayEqual(array0: any[], array1: any[]): boolean;
export declare function isInputChangeEvent(object: any): object is React.ChangeEvent<HTMLInputElement>;
export declare function isSelectChangeEvent(object: any): object is React.ChangeEvent<HTMLSelectElement>;
export declare function isYup(object: any): object is Yup.Schema<any>;
export declare function getFromObject(object: any, keys: string | string[], defaultVal?: any): any;
export declare function fromProxy<TModel, TValue>(proxy: TModel, selector: (model: TModel) => TValue, defaultValue?: any): TValue;
export declare function autoCreateProxy<T extends object>(model: T): T;
export declare function getPath(selector: (obj) => any, data: any): string;
export declare function forEachElement<TValue, TResult>(iterator: IterableIterator<TValue>, action: (element: TValue) => TResult): IterableIterator<any>;
export declare function exchangeIterator<TValue, TResult>(iterator: IterableIterator<TValue>, action: (element: TValue) => IterableIterator<TResult>): IterableIterator<TResult>;
export declare function setPathValue<T>(value: any, selector: (obj: T) => any, to: T): void;
