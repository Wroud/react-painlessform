/// <reference types="react" />
import * as React from "react";
import { FieldSelector, IUpdateEvent } from "../interfaces/field";
import { IFormStorage } from "../interfaces/form";
/**
 * Describes [[Transform]] props
 */
export interface ITranformProps<T extends object> {
    /**
     * Transformer function that accepts changed `field` and his `value` and form `model`
     * and returns fields map to update values
     */
    transformer?: (value: IUpdateEvent, is: (field: FieldSelector<T>, strict?: boolean) => boolean, state: IFormStorage<T>) => IterableIterator<IUpdateEvent>;
    [key: string]: any;
}
export interface ITransformContext<T extends object> {
    mountTransform: (transformer: Transform<T>) => any;
    unMountTransform: (transformer: Transform<T>) => any;
}
export declare const Provider: React.ComponentType<React.ProviderProps<ITransformContext<any>>>, Consumer: React.ComponentType<React.ConsumerProps<ITransformContext<any>>>;
export interface ITransform<T extends object> extends Transform<T> {
    new (props: ITranformProps<T>): Transform<T>;
}
/**
 * Transform is React Component that accpts [[ITranformProps]] as props
 * and passes [[transformer]] function as [[TransformContext]]
 */
export declare class Transform<T extends object> extends React.Component<ITranformProps<T>> {
    private transformers;
    private _context;
    transform: (events: IterableIterator<IUpdateEvent>, state: IFormStorage<T>) => IterableIterator<IUpdateEvent>;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private mountTransform;
    private unMountTransform;
}
