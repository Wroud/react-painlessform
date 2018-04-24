import * as React from "react";
import shallowequal = require("shallowequal");

import { IErrorMessage } from "../FormValidator";
import { IFieldState } from "../interfaces/field";
import { isArrayEqual } from "../tools";
import { Consumer as FormContext, IFormState } from "./Form";
import { Consumer as ValidationContext } from "./Validation";

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
    [key: string]: any;
}

export const { Provider, Consumer } = React.createContext<IClassProps<any>>();

export class FieldClass<T> extends React.Component<IClassProps<T>> {
    private inputValue: any;

    render() {
        const { children } = this.props as IClassProps<T>;
        const props: IClassProps<T> = {
            ...this.props as any,
            onChange: this.handleChange,
            onClick: this.onClick,
        };
        const rChildren = children
            && typeof children === "function"
            ? children(props)
            : children;

        return (
            <Provider value={props}>
                {rChildren}
            </Provider>
        );
    }

    componentDidMount() {
        this.update(); // mount field to form model
    }

    shouldComponentUpdate(nextProps: IClassProps<T>) {
        const {
            validationErrors: nextErrors, validationScope: nextScope,
            formState: _,
            children: __,
            ...nextRest } = nextProps as any;
        const {
            validationErrors, validationScope,
            formState,
            children,
            ...rest } = this.props as IClassProps<T> as any;

        if (
            !isArrayEqual(
                (validationErrors || []).map(error => error.message),
                (nextErrors || []).map(error => error.message))
            || !isArrayEqual(
                (validationScope || []).map(error => error.message),
                (nextScope || []).map(error => error.message))
            || !shallowequal(nextRest, rest)
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
        } = this.props;

        const updValue = {
            value,
            isChanged,
            isVisited,
            ...(nextValue || {}),
        };

        handleChange(name, updValue);

        if (this.props.onChange) {
            this.props.onChange(this.props.name, updValue);
        }
    }
}

export interface IFieldProps<TName extends keyof TModel, TValue extends TModel[TName], TModel> {
    name: TName;
    value?: TValue;
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
        return (
            <FormContext>
                {(formState: IFormState<T>) => (
                    <ValidationContext>
                        {validation => {
                            const props = this.props as FieldProps<T>;
                            const modelValue = formState.model[props.name];
                            const value = modelValue === undefined ? "" : modelValue.value;
                            const isChanged = modelValue === undefined ? false : modelValue.isChanged;
                            const isVisited = modelValue === undefined ? false : modelValue.isVisited;

                            // if (modelValue === undefined) {
                            //     formState.handleChange(props.name, {
                            //         value, isChanged, isVisited,
                            //     });
                            // }
                            const isValid =
                                (validation.errors[this.props.name] === undefined
                                    || validation.errors[this.props.name].length === 0)
                                && (validation.scope === undefined || validation.scope.length === 0);

                            const _Field = FieldClass as IFieldClass<any>;
                            return (
                                <_Field
                                    {...props}
                                    value={value}
                                    validationErrors={validation.errors[this.props.name]}
                                    validationScope={validation.scope}
                                    formState={formState}
                                    isChanged={isChanged}
                                    isVisited={isVisited}
                                    isValid={isValid}
                                />
                            );
                        }}
                    </ValidationContext>
                )}
            </FormContext>
        );
    }
}

// interface IModel {
//     field: string;
//     field2: number;
// }

// const F = Field as IField<IModel>;
// const onChange = (field: string, value: IFieldState<string>) => ({});

// const field = <F name={"field"} value={""} onChange={onChange} />;
// const field2 = <F name={"field2"} value={2} onChange={onChange} />;
