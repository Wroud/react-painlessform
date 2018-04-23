import * as React from "react";
import shallowequal = require("shallowequal");

import { IErrorMessage } from "../FormValidator";
import { IFieldState } from "../interfaces/field";
import { isArrayEqual } from "../tools";
import { Consumer as FormContext, IFormState } from "./Form";
import { Consumer as ValidationContext, IValidationContext } from "./Validation";

export interface IFieldClass<N extends keyof T, V extends T[N], T> extends FieldClass<N, V, T> {
    new(props: IFieldClassProps<N, V, T>): FieldClass<N, V, T>;
}

export interface IFieldClassProps<N extends keyof T, V extends T[N], T> {
    // Form controlled fields
    value: V;
    formState: IFormState<T>;
    validationErrors: Array<IErrorMessage<any>>;
    validationScope: Array<IErrorMessage<any>>;
    isVisited: boolean;
    isChanged: boolean;
    isValid: boolean;
    //

    name: N;
    children?: ((state: IFieldClassProps<N, V, T>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<V>) => any;
    [key: string]: any;
}

export const { Provider, Consumer } = React.createContext<IFieldClassProps<any, any, any>>();

export class FieldClass<N extends keyof T, V extends T[N], T> extends React.Component<IFieldClassProps<N, V, T>> {
    private inputValue: any;

    render() {
        const { children } = this.props;
        const props = {
            ...this.props,
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

    shouldComponentUpdate(nextProps: IFieldClassProps<N, V, T>) {
        const {
            validationErrors: nextErrors, validationScope: nextScope,
            formState: _,
            children: __,
            ...nextRest } = nextProps;
        const {
            validationErrors, validationScope,
            formState,
            children,
            ...rest } = this.props;

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

    private update = (nextValue?: Partial<IFieldState<V>>) => {
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

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IFieldProps<N extends keyof T, V extends T[N], T> {
    name: N;
    children?: ((state: IFieldClassProps<N, V, T>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<V>) => any;
}

export interface IField<N extends keyof T, V extends T[N], T> extends Field<N, V, T> {
    new(props: IFieldProps<N, V, T>): Field<N, V, T>;
}

export class Field<N extends keyof T, V extends T[N], T> extends React.Component<IFieldProps<N, V, T>> {
    render() {
        return (
            <FormContext>
                {formState => (
                    <ValidationContext>
                        {validation => {
                            const modelValue = formState.model[this.props.name];
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

                            return (
                                <FieldClass
                                    {...this.props}
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
