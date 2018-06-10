/// <reference types="react" />
import * as React from "react";
import { IUpdateEvent } from "../interfaces/field";
import { IFormStorage } from "../interfaces/form";
import { IsField } from "../interfaces/transform";
/**
 * Describes [[Transform]] props
 */
export interface ITranformProps<TModel extends object> {
    /**
     * Transformer function that accepts changed `field` and his `value` and form `model`
     * and returns fields map to update values
     */
    transformer?: (value: IUpdateEvent<TModel>, is: IsField<TModel>, state: IFormStorage<TModel>) => IterableIterator<IUpdateEvent<TModel>>;
    [key: string]: any;
}
export interface ITransformContext<T extends object> {
    mountTransform: (transformer: Transform<T>) => any;
    unMountTransform: (transformer: Transform<T>) => any;
}
export declare const Provider: React.ComponentType<React.ProviderProps<ITransformContext<any> | undefined>>, Consumer: React.ComponentType<React.ConsumerProps<ITransformContext<any> | undefined>>;
export interface ITransform<T extends object> extends Transform<T> {
    new (props: ITranformProps<T>): Transform<T>;
}
/**
 * Transform is React Component that accpts [[ITranformProps]] as props
 * and passes [[transformer]] function as [[TransformContext]]
 */
export declare class Transform<TModel extends object> extends React.Component<ITranformProps<TModel>> {
    private transformers;
    private _context;
    transform: (events: IterableIterator<IUpdateEvent<TModel>>, state: IFormStorage<TModel>) => IterableIterator<IUpdateEvent<TModel>>;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private scope;
    private mountTransform;
    private unMountTransform;
}
