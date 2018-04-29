/// <reference types="react" />
import * as React from "react";
import { IFieldState } from "../interfaces/field";
/**
 * Describes [[Transform]] props
 */
export interface ITranformProps<T> {
    /**
     * Transformer function that accepts changed `field` and his `value` and form `model`
     * and returns fields map to update values
     */
    transformer: (field: keyof T, value: IFieldState<T[typeof field]>, model: T) => Partial<T>;
    [key: string]: any;
}
export declare type ITransformContext<T> = (field: keyof T, value: IFieldState<T[typeof field]>) => any;
export declare const Provider: React.ComponentClass<{
    value: ITransformContext<any>;
}>, Consumer: React.ComponentClass<{
    children?: (context: ITransformContext<any>) => React.ReactNode;
}>;
export interface ITransform<T> extends Transform<T> {
    new (props: ITranformProps<T>): Transform<T>;
}
/**
 * Transform is React Component that accpts [[ITranformProps]] as props
 * and passes [[transformer]] function as [[TransformContext]]
 */
export declare class Transform<T> extends React.Component<ITranformProps<T>> {
    render(): JSX.Element;
}
