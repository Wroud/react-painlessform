import * as React from "react";
import shallowequal = require("shallowequal");

import { IErrorMessage } from "../FormValidator";
import { getInputChecked, getInputValue, getValue, isValueEqual, setValue } from "../helpers/form";
import { createFormFactory } from "../helpers/formFactory";
import { IFieldState } from "../interfaces/field";
import { isArrayEqual, isFieldState, isInputChangeEvent, isSelectChangeEvent } from "../tools";
import { IFormContext, IFormState } from "./Form";

export type MapExclude<C, U extends keyof M, M> = C extends M[U] ? M[U] : never;
export type InputType<C> = C extends Array<infer V>
    ? (V extends boolean ? string[] : V)
    : (C extends boolean ? string : C);

export type ExtendFieldClass<
    TName extends keyof TModel,
    TValue extends TModel[TName],
    TModel,
    > =
    TName extends keyof TModel
    ? IFieldClassProps<TName, MapExclude<TValue, TName, TModel>, TModel>
    : never;

export type ClassProps<T> = ExtendFieldClass<keyof T, T[keyof T], T>;

export type ExtendFieldContext<
    TName extends keyof TModel,
    TValue extends TModel[TName],
    TModel,
    > =
    TName extends keyof TModel
    ? IFieldContext<TName, MapExclude<TValue, TName, TModel>, TModel>
    : never;

export type FieldModelContext<T> = ExtendFieldContext<keyof T, T[keyof T], T>;

export interface IFieldClass<T> extends FieldClass<T> {
    new(props: ClassProps<T>): FieldClass<T>;
}

export interface IInputHook<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    /**
     * Field name
     */
    name: TName;
    /**
     * Value of [[FieldClass]]
     */
    value: InputType<TValue>;
    multiple: boolean;
    checked: boolean;
    type: string;
    onFocus: () => any;
    onBlur: () => any;
    onClick: () => any;
    onChange: (value: TValue | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => any;
}

export interface IFieldBase<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    // Form controlled fields
    /**
     * [[Form]] context
     */
    form: IFormContext<TModel>;
    /**
     * Validation errors from [[Validation]] context
     */
    validationErrors: Array<IErrorMessage<any>>;
    /**
     * Form scope Validation errors from [[Validation]] context
     */
    validationScope: Array<IErrorMessage<any>>;
    isVisited: boolean;
    isChanged: boolean;
    isValid: boolean;
    isFocus: boolean;
    //

    /**
     * Rest passed to [[Field]]
     */
    rest: { [key: string]: any };
}

/**
 * Describes props for [[FieldClass]]
 */
export interface IFieldClassProps<TName extends keyof TModel, TValue extends TModel[TName], TModel>
    extends IFieldBase<TName, TValue, TModel> {
    /**
     * Value of [[FieldClass]]
     */
    value: TValue;
    index: number;
    forwardedValue: InputType<TValue>;
    /**
     * Field name
     */
    name: TName;
    type: string;
    multiple: boolean;
    onFocus: () => any;
    onBlur: () => any;
    /**
     * Click event handler
     */
    onClick?: () => any;
    /**
     * Change [[Form]] event handler
     */
    onChange?: (field: string, value: IFieldState<TValue>) => any;
    /**
     * Accepts `(context: FieldModelContext<TModel>) => React.ReactNode` function or `React.ReactNode`
     * if `children` is `React.ReactNode` then pass [[FieldModelContext]] via FieldContext
     */
    children?: ((context: FieldModelContext<TModel>) => React.ReactNode) | React.ReactNode;
}
/**
 * Describes FieldContext
 */
export interface IFieldContext<TName extends keyof TModel, TValue extends TModel[TName], TModel>
    extends IFieldBase<TName, TValue, TModel> {
    value: TValue;
    inputHook: IInputHook<TName, TValue, TModel>;
}

/**
 * Default [[FieldClass]] props and FieldContext value
 */
const defaultProps: Partial<FieldModelContext<any>> = {
    validationErrors: [],
    validationScope: [],
    rest: {},
    form: {
        model: {}
    } as any
};

export const { Provider, Consumer } = React.createContext<FieldModelContext<any>>(defaultProps as any);

/**
 * FieldClass React component accepts [[ClassProps]] as props
 */
export class FieldClass<T> extends React.Component<ClassProps<T>> {
    static defaultProps = defaultProps;
    render() {
        const {
            value: _value,
            index,
            forwardedValue,
            type,
            multiple,
            name,
            children,
            onBlur,
            onChange,
            onClick,
            onFocus,
            ...rest
        } = this.props as ClassProps<T> as any;

        const value = getValue(_value, type, forwardedValue, index);

        const context = {
            ...rest,
            inputHook: {
                name,
                type,
                value: getInputValue(value, forwardedValue, type, multiple),
                checked: getInputChecked(value, forwardedValue, type),
                multiple,
                onChange: this.handleChange,
                onClick: this.onClick,
                onFocus: this.handleFocus(true),
                onBlur: this.handleFocus(false)
            }
        } as FieldModelContext<T>;

        return children && typeof children === "function"
            ? children(context)
            : <Provider value={context} children={children} />;
    }

    /**
     * Mount field to form model if passed `value` is `undefined`
     * with empty string `value`
     */
    componentDidMount() {
        if (this.props.value === undefined) {
            this.update({
                value: "",
                isVisited: false,
                isChanged: false,
                isFocus: false
            }); // mount field to form model
        }
    }

    componentWillUnmount() {
        this.update({ unmount: true } as any);
    }

    /**
     * Remount field to form model (if passed `value` is `undefined`)
     * with empty string `value`
     */
    componentDidUpdate(prevProps: ClassProps<T>) {
        if (this.props.value === undefined) {
            this.update({
                value: "",
                isVisited: false,
                isChanged: false,
                isFocus: false
            }); // remount field if it not exists in form model
        }
    }

    /**
     * Field updates only if
     * `value` || `name` || `isVisited` || `isChanged`
     * `isValid` || `validationErrors` || `validationScope`
     * `rest` was changed
     */
    shouldComponentUpdate(nextProps: ClassProps<T>) {
        const {
            value: nextValue,
            forwardedValue: nextForwardedValue,
            children: _,
            validationErrors: nextErrors, validationScope: nextScope,
            rest: nextRest,
            ...nextRestProps
        } = nextProps as ClassProps<T> as any;
        const {
            value,
            forwardedValue,
            children,
            validationErrors, validationScope,
            rest,
            restProps
        } = this.props as ClassProps<T> as any;

        if (
            !isValueEqual(
                getValue(nextValue, nextProps.type, nextForwardedValue, nextProps.index),
                getValue(value, this.props.type, forwardedValue, this.props.index)
            )
            || !isValueEqual(nextForwardedValue, forwardedValue)
            || !isArrayEqual(
                validationErrors.map(error => error.message),
                nextErrors.map(error => error.message))
            || !isArrayEqual(
                validationScope.map(error => error.message),
                nextScope.map(error => error.message))
            || !shallowequal(nextRest, rest)
            || !shallowequal(nextRestProps, restProps)
        ) {
            return true;
        }
        return false;
    }

    private handleFocus = (type: boolean) => () => {
        const { onBlur, onFocus } = this.props as ClassProps<T>;
        this.update({ isFocus: type });
        if (type && onFocus) {
            onFocus();
        }
        if (!type && onBlur) {
            onBlur();
        }
    }
    /**
     * Update field `isVisited` to `true`
     */
    private setVisited() {
        if (!this.props.isVisited) {
            this.update({ isVisited: true });
        }
    }

    /**
     * Call [[setVisited]] and [[onClick]]
     */
    private onClick = () => {
        this.setVisited();
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    /**
     * Get `value` from `React.ChangeEvent<HTMLInputElement>` or pass as it is
     * set `isVisited` & `isChanged` to `true`
     */
    private handleChange = (value: T | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { type } = this.props as ClassProps<T>;
        let nextValue;
        if (isSelectChangeEvent(value)) {
            const { checked, value: targetValue, options } = value.target;
            if (!this.props.multiple) {
                nextValue = targetValue;
            } else {
                nextValue = [];
                for (let i = 0, l = options.length; i < l; i++) {
                    if (options[i].selected) {
                        nextValue.push(options[i].value);
                    }
                }
            }
        } else if (isInputChangeEvent(value)) {
            const { checked, value: targetValue } = value.target;

            nextValue =
                /number|range/.test(type)
                    ? parseFloat(targetValue)
                    : /checkbox/.test(type)
                        ? checked
                        : targetValue;
        } else {
            nextValue = value;
        }

        this.update({
            value: nextValue,
            isVisited: true,
            isChanged: true
        });
    }

    /**
     * Call [[Form]] `handleChange` with `name` & new `value`
     * and call [[onChange]] from props
     */
    private update = (nextValue?: Partial<IFieldState<any>>) => {
        const {
            index,
            type,
            multiple,
            forwardedValue,
            form: { handleChange },
            name,
            value,
            isChanged,
            isVisited,
            isFocus,
            onChange
        } = this.props as ClassProps<T>;

        const updValue = {
            isChanged,
            isVisited,
            isFocus,
            ...(nextValue || {}),
            value: isFieldState(nextValue) // true when value changed
                ? setValue(value as any, nextValue.value, forwardedValue, type, index, "unmount" in nextValue, multiple)
                : value
        } as IFieldState<any>;

        handleChange(name as any, updValue);

        if (onChange) {
            onChange(name, updValue);
        }
    }
}

/**
 * Describes [[Field]] props
 */
export interface IFieldProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    name: TName;
    index?: number;
    value?: InputType<TValue>;
    type?: string;
    multiple?: boolean;
    subscribe?: (formState: IFormState<TModel>) => any;
    onClick?: () => any;
    onFocus?: () => any;
    onBlur?: () => any;
    onChange?: (field: string, value: IFieldState<TValue>) => any;
    children?: ((context: FieldModelContext<TModel>) => React.ReactNode) | React.ReactNode;
    [key: string]: any;
}

export type ExtendFieldProps<
    TName extends keyof TModel,
    TValue extends TModel[TName],
    TModel,
    > =
    TName extends keyof TModel
    ? IFieldProps<TName, MapExclude<TValue, TName, TModel>, TModel>
    : never;

export type FieldProps<T> = ExtendFieldProps<keyof T, T[keyof T], T>;

export interface IField<T> extends Field<T> {
    new(props: FieldProps<T>): Field<T>;
}

/**
 * HOC for [[FieldClass]] that connects [[FormContext]], [[ValidationContext]]
 * and [[TransformContext]] and pass it to [[FieldClass]] as props
 */
export class Field<T> extends React.Component<FieldProps<T>> {
    static defaultProps = { type: "text" };
    render() {
        const { FormContext, ValidationContext } = createFormFactory<T>();
        return (
            <FormContext>
                {formContext => (
                    <ValidationContext>
                        {validation => {
                            const {
                                value: propsValue,
                                name,
                                index,
                                type,
                                multiple,
                                children,
                                subscribe,
                                onClick,
                                onChange,
                                onFocus,
                                onBlur,
                                ...rest
                            } = this.props as FieldProps<T> as any;

                            let fullRest = rest;
                            if (subscribe !== undefined) {
                                fullRest = {
                                    ...fullRest,
                                    ...subscribe(formContext)
                                };
                            }
                            const modelValue = formContext.model[name];
                            const value = modelValue === undefined
                                ? undefined
                                : modelValue.value;
                            const isChanged = modelValue === undefined ? false : modelValue.isChanged;
                            const isVisited = modelValue === undefined ? false : modelValue.isVisited;
                            const isFocus = modelValue === undefined ? false : modelValue.isFocus;

                            const isValid =
                                (validation.errors[name] === undefined
                                    || validation.errors[name].length === 0)
                                && (validation.scope === undefined || validation.scope.length === 0);

                            const _Field = FieldClass as any as IFieldClass<any>;
                            return (
                                <_Field
                                    name={name}
                                    type={type}
                                    multiple={multiple}
                                    value={value}
                                    index={index}
                                    forwardedValue={propsValue}
                                    validationErrors={validation.errors[name]}
                                    validationScope={validation.scope}
                                    form={formContext}
                                    isChanged={isChanged}
                                    isVisited={isVisited}
                                    isValid={isValid}
                                    isFocus={isFocus}
                                    onClick={onClick}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    onFocus={onFocus}
                                    children={children}
                                    rest={fullRest}
                                />
                            );
                        }}
                    </ValidationContext>
                )}
            </FormContext>
        );
    }
}
