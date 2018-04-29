/// <reference types="react" />
import * as React from "react";
import { FormModel } from "../interfaces/form";
/**
 * Describes [[Transform]] props
 */
export interface ITranformProps<T> {
    /**
     * Transformer function that accepts changed `field` and his `value` and form `model`
     * and returns fields map to update values
     */
    transformer: (values: Partial<FormModel<T>>, model: FormModel<T>) => Partial<FormModel<T>>;
    [key: string]: any;
}
export interface ITransformContext<T> {
    mountTransform: (transformer: Transform<T>) => any;
    unMountTransform: (transformer: Transform<T>) => any;
}
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
    private transformers;
    private _context;
    transform: (values: Partial<FormModel<T>>, prevModel: FormModel<T>) => Partial<FormModel<T>>;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private mountTransform;
    private unMountTransform;
}
