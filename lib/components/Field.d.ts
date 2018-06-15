/// <reference types="react" />
import * as React from "react";
import { IErrorMessage } from "../FormValidator";
import { FieldPath, FieldValue, IFieldState, InputValue } from "../interfaces/field";
import { ISubscriptionsMap, SubscriptionsMap } from "../interfaces/store";
import { IFormContext } from "./Form";
import { ISubscribeContext, ISubscriber } from "./Subscribe";
export interface IFieldClass<TModel extends object> {
    new <TValue, TSub>(props: IFieldClassProps<TValue, TModel, TSub>): FieldClass<TValue, TModel, TSub>;
}
export interface IInputHook<TModel> {
    name: string;
    value: InputValue;
    multiple?: boolean;
    checked?: boolean;
    type: string;
    onFocus: () => any;
    onBlur: () => any;
    onClick: () => any;
    onChange: (value: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, state?: IFieldState | null) => any;
}
export interface IFieldBase<TValue extends FieldValue, TModel extends object, TSub> {
    name: FieldPath<TModel, TValue>;
    value?: TValue;
    /**
     * Value passed to [[Field]]
     */
    forwardedValue?: InputValue;
    defaultValue?: TValue;
    multiple?: boolean;
    type: string;
    form: IFormContext<TModel>;
    validationErrors: Array<IErrorMessage<any>>;
    validationScope: Array<IErrorMessage<any>>;
    isVisited: boolean;
    isChanged: boolean;
    isFocus: boolean;
    isValid: boolean;
    /**
     * Rest props passed to [[Field]]
     */
    rest: {
        [key: string]: any;
    } & TSub;
}
/**
 * Describes props for [[FieldClass]]
 */
export interface IFieldClassProps<TValue extends FieldValue, TModel extends object, TSub> extends IFieldBase<TValue, TModel, TSub> {
    onFocus?: () => any;
    onBlur?: () => any;
    onClick?: () => any;
    onChange?: (value?: TValue | null, nextState?: IFieldState | null) => any;
    /**
     * Accepts `(context: FieldModelContext<TModel>) => React.ReactNode` function or `React.ReactNode`
     * if `children` is `React.ReactNode` then pass [[FieldModelContext]] via FieldContext
     */
    children?: ((context: IFieldContext<TValue, TModel, TSub>) => React.ReactNode) | React.ReactNode;
}
/**
 * Describes FieldContext
 */
export interface IFieldContext<TValue extends FieldValue, TModel extends object, TSub> extends IFieldBase<TValue, TModel, TSub> {
    inputHook: IInputHook<TModel>;
    onFocus: () => any;
    onBlur: () => any;
    onClick: () => any;
    onChange: (value?: TValue | null, state?: IFieldState | null) => any;
}
export declare const Provider: React.ComponentType<React.ProviderProps<IFieldContext<any, any, any> | undefined>>, Consumer: React.ComponentType<React.ConsumerProps<IFieldContext<any, any, any> | undefined>>;
/**
 * FieldClass React component accepts [[ClassProps]] as props
 */
export declare class FieldClass<TValue extends FieldValue, TModel extends object, TSub> extends React.Component<IFieldClassProps<TValue, TModel, TSub>> {
    render(): {} | null | undefined;
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    mountValue(): void;
    private handleFocus;
    /**
     * Call [[setVisited]] and [[onClick]]
     */
    private onClick;
    /**
     * Get `value` from `React.ChangeEvent<HTMLInputElement | HTMLSelectElement>`
     * set `isVisited` & `isChanged` to `true`
     */
    private handleHTMLInputChange;
    private handleChange;
    /**
     * Call [[Form]] `handleChange` with [[IUpdateEvent]] as argument
     * and call [[onChange]] from props
     */
    private update;
}
/**
 * Describes [[Field]] props
 */
export interface IFieldProps<TValue, TModel extends object, TSub extends ISubscriptionsMap<TModel>> {
    name: (model: TModel) => TValue;
    value?: InputValue;
    defaultValue?: TValue;
    type?: string;
    multiple?: boolean;
    subscribe?: TSub;
    onClick?: () => any;
    onFocus?: () => any;
    onBlur?: () => any;
    onChange?: (value?: TValue | null, nextState?: IFieldState | null) => any;
    children?: ((context: IFieldContext<TValue, TModel, SubscriptionsMap<TSub>>) => React.ReactNode) | React.ReactNode;
    [key: string]: any;
}
export interface IField<TModel extends object> extends Field<any, TModel, any> {
    new <TValue, TSub extends ISubscriptionsMap<TModel>>(props: IFieldProps<TValue, TModel, TSub>): Field<TValue, TModel, TSub>;
}
/**
 * HOC for [[FieldClass]] that connects [[FormContext]], [[ValidationContext]]
 * and [[TransformContext]] and pass it to [[FieldClass]] as props
 */
export declare class Field<TValue, TModel extends object, TSub extends ISubscriptionsMap<TModel>> extends React.Component<IFieldProps<TValue, TModel, TSub>> implements ISubscriber {
    static defaultProps: {
        type: string;
    };
    formContext: IFormContext<TModel>;
    subscribeContext: ISubscribeContext<any, any>;
    path?: FieldPath<TModel, TValue>;
    field: React.RefObject<FieldClass<TValue, TModel, SubscriptionsMap<TSub>>>;
    private subscriptions;
    render(): JSX.Element;
    smartUpdate(events: Array<FieldPath<any, any>>): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
