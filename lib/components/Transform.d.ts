/// <reference types="react" />
import * as React from "react";
import { IFieldState } from "../interfaces/field";
export interface ITranformProps<T> {
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
export declare class Transform<T> extends React.Component<ITranformProps<T>> {
    render(): JSX.Element;
}
