import * as React from "react";
import shallowequal = require("shallowequal");

import { IErrorMessage } from "../FormValidator";
import { createFormFactory } from "../helpers/formFactory";
import { IFieldState } from "../interfaces/field";
import { isArrayEqual } from "../tools";
import { IFormState } from "./Form";

export type Exclude<C, U extends keyof M, M> = C extends M[U] ? M[U] : never;

export type ExtendFieldClass<
    TName extends keyof TModel,
    TValue extends TModel[TName],
    TModel,
    > =
    TName extends keyof TModel
    ? IFieldClassProps<TName, Exclude<TValue, TName, TModel>, TModel>
    : never;

export type IClassProps<T> = ExtendFieldClass<keyof T, T[keyof T], T>;

export interface IFieldClass<T> extends FieldClass<T> {
    new(props: IClassProps<T>): FieldClass<T>;
}

export interface IFieldClassProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    // Form controlled fields
    value: TValue;
    formState: IFormState<TModel>;
    validationErrors: Array<IErrorMessage<any>>;
    validationScope: Array<IErrorMessage<any>>;
    isVisited: boolean;
    isChanged: boolean;
    isValid: boolean;
    //

    name: TName;
    children?: ((state: IFieldClassProps<TName, TValue, TModel>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<TValue>) => any;
    rest: { [key: string]: any };
}

const defaultProps: Partial<IClassProps<any>> = {
    validationErrors: [],
    validationScope: [],
    rest: {},
    formState: {
        model: {},
    } as any,
};

export const { Provider, Consumer } = React.createContext<IClassProps<any>>(defaultProps);

export class FieldClass<T> extends React.Component<IClassProps<T>> {
    static defaultProps = defaultProps;
    render() {
        const { value, children } = this.props as IClassProps<T>;

        const context = {
            ...this.props as any,
            value: value === undefined ? "" : value,
            onChange: this.handleChange,
            onClick: this.onClick,
        };

        return (
            children && typeof children === "function"
                ? children(context)
                : <Provider value={context}>{children}</Provider>
        );
    }

    componentDidMount() {
        this.update({
            value: "",
        }); // mount field to form model
    }

    componentDidUpdate(prevProps: IClassProps<T>) {
        if (prevProps.value === undefined) {
            this.update({
                value: "",
            }); // remount field if it not exists in form model
        }
    }

    shouldComponentUpdate(nextProps: IClassProps<T>) {
        const {
            name: nextName,
            value: nextValue,
            isVisited: nextIsVisited,
            isChanged: nextIsChanged,
            isValid: nextIsValid,

            validationErrors: nextErrors, validationScope: nextScope,
            rest: nextRest,
        } = nextProps as IClassProps<T>;
        const {
            name, value, isVisited, isChanged, isValid,
            validationErrors, validationScope,
            rest,
        } = this.props as IClassProps<T>;

        if (
            !isArrayEqual(
                validationErrors.map(error => error.message),
                nextErrors.map(error => error.message))
            || !isArrayEqual(
                validationScope.map(error => error.message),
                nextScope.map(error => error.message))
            || !shallowequal(nextRest, rest)
            || !shallowequal(
                { nextName, nextValue, nextIsChanged, nextIsValid, nextIsVisited },
                { name, value, isVisited, isChanged, isValid },
            )
        ) {
            return true;
        }
        return false;
    }

    private setVisited() {
        if (!this.props.isVisited) {
            this.update({ isVisited: true });
        }
    }

    private onClick = () => {
        this.setVisited();
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    private handleChange = (value: any | React.ChangeEvent<HTMLInputElement>) => {
        let nextValue;
        if (value.target !== undefined) {
            const { type, checked, value: targetValue } = (value as React.ChangeEvent<HTMLInputElement>).target;
            nextValue = type === "checkbox" ? checked : targetValue;
            // const name = !target.name ? target.id : target.name;
        } else {
            nextValue = value;
        }

        this.update({
            value: nextValue,
            isVisited: true,
            isChanged: true,
        });
    }

    private update = (nextValue?: Partial<IFieldState<any>>) => {
        const {
            formState: { handleChange },
            name,
            value,
            isChanged,
            isVisited,
            onChange,
        } = this.props as IClassProps<T>;

        const updValue = {
            value,
            isChanged,
            isVisited,
            ...(nextValue || {}),
        };

        handleChange(name as any, updValue);

        if (onChange) {
            onChange(name, updValue);
        }
    }
}

export interface IFieldProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    name: TName;
    children?: ((state: IClassProps<TModel>) => React.ReactNode) | React.ReactNode;
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
    ? IFieldProps<TName, Exclude<TValue, TName, TModel>, TModel>
    : never;

export type FieldProps<T> = ExtendFieldProps<keyof T, T[keyof T], T>;

export interface IField<T> extends Field<T> {
    new(props: FieldProps<T>): Field<T>;
}

export class Field<T> extends React.Component<FieldProps<T>> {
    render() {
        const { FormContext, ValidationContext, TransformContext } = createFormFactory<T>();
        return (
            <FormContext>
                {formState => (
                    <ValidationContext>
                        {validation => (
                            <TransformContext>
                                {handleChange => {
                                    const {
                                        name,
                                        children,
                                        onClick,
                                        onChange,
                                        ...rest,
                                    } = this.props as FieldProps<T> as any;
                                    let formContext = formState;
                                    if (handleChange !== undefined) {
                                        formContext = {
                                            ...formContext,
                                            handleChange,
                                        };
                                    }
                                    const modelValue = formState.model[name];
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
                                            formState={formContext}
                                            isChanged={isChanged}
                                            isVisited={isVisited}
                                            isValid={isValid}
                                            onClick={onClick}
                                            onChange={onChange}
                                            children={children}
                                            rest={rest}
                                        />
                                    );
                                }}
                            </TransformContext>
                        )}
                    </ValidationContext>
                )}
            </FormContext>
        );
    }
}
