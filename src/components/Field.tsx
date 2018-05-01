import * as React from "react";
import shallowequal = require("shallowequal");

import { IErrorMessage } from "../FormValidator";
import { createFormFactory } from "../helpers/formFactory";
import { IFieldState } from "../interfaces/field";
import { isArrayEqual, isChangeEvent } from "../tools";
import { IFormContext, IFormState } from "./Form";

export type MapExclude<C, U extends keyof M, M> = C extends M[U] ? M[U] : never;

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

export interface IFieldBase<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    // Form controlled fields
    /**
     * Value of [[FieldClass]]
     */
    value: TValue;
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
    //

    /**
     * Field name
     */
    name: TName;
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
     * Accepts `(context: FieldModelContext<TModel>) => React.ReactNode` function or `React.ReactNode`
     * if `children` is `React.ReactNode` then pass [[FieldModelContext]] via FieldContext
     */
    children?: ((context: FieldModelContext<TModel>) => React.ReactNode) | React.ReactNode;
    /**
     * Click event handler
     */
    onClick?: () => any;
    /**
     * Change [[Form]] event handler
     */
    onChange?: (field: string, value: IFieldState<TValue>) => any;
}
/**
 * Describes FieldContext
 */
export interface IFieldContext<TName extends keyof TModel, TValue extends TModel[TName], TModel>
    extends IFieldBase<TName, TValue, TModel> {
    /**
     * Click event handler
     */
    onClick?: () => any;
    onChange?: (value: TValue | React.ChangeEvent<HTMLInputElement>) => any;
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
        const { value, children, ...rest } = this.props as ClassProps<T> as any;

        const context = {
            ...rest,
            value: value === undefined ? "" : value,
            onChange: this.handleChange,
            onClick: this.onClick
        };

        return children && typeof children === "function"
            ? children(context)
            : <Provider value={context}>{children}</Provider>;
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
                isChanged: false
            }); // mount field to form model
        }
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
                isChanged: false
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
            name: nextName,
            value: nextValue,
            isVisited: nextIsVisited,
            isChanged: nextIsChanged,
            isValid: nextIsValid,

            validationErrors: nextErrors, validationScope: nextScope,
            rest: nextRest
        } = nextProps as ClassProps<T>;
        const {
            name, value, isVisited, isChanged, isValid,
            validationErrors, validationScope,
            rest
        } = this.props as ClassProps<T>;

        if (
            !isArrayEqual(
                validationErrors.map(error => error.message),
                nextErrors.map(error => error.message))
            || !isArrayEqual(
                validationScope.map(error => error.message),
                nextScope.map(error => error.message))
            || !shallowequal(nextRest, rest)
            || !shallowequal(
                {
                    name: nextName,
                    value: nextValue,
                    isVisited: nextIsVisited,
                    isChanged: nextIsChanged,
                    isValid: nextIsValid
                },
                { name, value, isVisited, isChanged, isValid }
            )
        ) {
            return true;
        }
        return false;
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
    private handleChange = (value: T | React.ChangeEvent<HTMLInputElement>) => {
        let nextValue;
        if (isChangeEvent(value)) {
            const { type, checked, value: targetValue } = value.target;
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
            form: { handleChange },
            name,
            value,
            isChanged,
            isVisited,
            onChange
        } = this.props as ClassProps<T>;

        const updValue = {
            value,
            isChanged,
            isVisited,
            ...(nextValue || {})
        };

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
    subscribe?: (formState: IFormState<TModel>) => any;
    children?: ((context: FieldModelContext<TModel>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<TValue>) => any;
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
    render() {
        const { FormContext, ValidationContext } = createFormFactory<T>();
        return (
            <FormContext>
                {formContext => (
                    <ValidationContext>
                        {validation => {
                            const {
                                name,
                                children,
                                subscribe,
                                onClick,
                                onChange,
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
                            const value = modelValue === undefined ? undefined : modelValue.value;
                            const isChanged = modelValue === undefined ? false : modelValue.isChanged;
                            const isVisited = modelValue === undefined ? false : modelValue.isVisited;

                            const isValid =
                                (validation.errors[name] === undefined
                                    || validation.errors[name].length === 0)
                                && (validation.scope === undefined || validation.scope.length === 0);

                            const _Field = FieldClass as any as IFieldClass<any>;
                            return (
                                <_Field
                                    name={name}
                                    value={value}
                                    validationErrors={validation.errors[name]}
                                    validationScope={validation.scope}
                                    form={formContext}
                                    isChanged={isChanged}
                                    isVisited={isVisited}
                                    isValid={isValid}
                                    onClick={onClick}
                                    onChange={onChange}
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
