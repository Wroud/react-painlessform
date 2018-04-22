import * as React from "react";
import shallowequal = require("shallowequal");

import { IErrorMessage } from "../FormValidator";
import { IFieldState } from "../interfaces/field";
import { isArrayEqual } from "../tools";
import { Consumer as FormContext, IFormState } from "./Form";
import { Consumer as ValidationContext, IValidationContext } from "./Validation";

export interface IFieldClass<N extends keyof T, V extends T[N], T> extends FieldClass<N, V, T> {
    new(props: IFieldProps<N, V, T>): FieldClass<N, V, T>;
}

export interface IFieldProps<N extends keyof T, V extends T[N], T> {
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
    children?: ((state: IFieldProps<N, V, T>) => React.ReactNode) | React.ReactNode;
    onClick?: () => any;
    onChange?: (field: string, value: IFieldState<V>) => any;
}

export const { Provider, Consumer } = React.createContext<IFieldProps<any, any, any>>();

export class FieldClass<N extends keyof T, V extends T[N], T> extends React.Component<IFieldProps<N, V, T>> {
    private inputValue: any;

    render() {
        const { children } = this.props;
        const rChildren = children
            && typeof children === "function"
            ? children(this.props)
            : children;

        return (
            <Provider value={this.props}>
                {rChildren}
            </Provider>
        );
    }

    componentDidMount() {
        this.update(); // mount field to form model
    }

    componentDidUpdate(prevProps: IFieldProps<N, V, T>) {
        // const { validator, formState } = this.props;
        // const { name, value } = this.state;
        // if (validator && value !== prevState.value) {
        //     formState.handleValidation(name, validator.validate(value));
        // }
    }

    shouldComponentUpdate(nextProps: IFieldProps<N, V, T>) {
        const {
            validationErrors: nextErrors, validationScope: nextScope,
            formState: _,
            ...nextRest } = nextProps;
        const {
            validationErrors, validationScope,
            formState,
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

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withFormState(Component) {
    return function FieldComponent<N extends keyof T, V extends T[N], T>(
        props: Omit<
            IFieldProps<N, V, T>,
            "value" | "validationErrors" | "validationScope" | "formState" | "isChanged" | "isVisited" | "isValid"
            >,
    ) {
        return (
            <FormContext>
                {formState => (
                    <ValidationContext>
                        {validation => {
                            const modelValue = formState.model[props.name];
                            const value = modelValue ? "" : modelValue.value;
                            const isChanged = modelValue ? false : modelValue.isChanged;
                            const isVisited = modelValue ? false : modelValue.isVisited;

                            // if (modelValue === undefined) {
                            //     formState.handleChange(props.name, {
                            //         value, isChanged, isVisited,
                            //     });
                            // }
                            const isValid =
                                (validation.errors[props.name] === undefined
                                    || validation.errors[props.name].length === 0)
                                && (validation.scope === undefined || validation.scope.length === 0);

                            return (
                                <Component
                                    {...props}
                                    value={value}
                                    validationErrors={validation.errors[props.name]}
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
    };
}

export const Field = withFormState(FieldClass);
