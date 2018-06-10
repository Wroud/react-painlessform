import * as React from "react";
import shallowequal = require("shallowequal");

import { IErrorMessage } from "../FormValidator";
import {
    autoCreateProxy,
    fromProxy,
    getPath,
    isInputChangeEvent,
    isSelectChangeEvent
} from "../tools";

import { castValue } from "../helpers/field";
import { getInputChecked, getInputValue, getValue } from "../helpers/form";
import { createFormFactory } from "../helpers/formFactory";

import { FieldSelector, FieldStateSelector, IFieldState } from "../interfaces/field";
import { IFormStorage } from "../interfaces/form";
import { ErrorsSelector } from "../interfaces/validation";

import { IFormContext } from "./Form";

export type InputType<C> = C extends Array<infer V>
    ? (V extends boolean ? string[] : V extends object ? string : V)
    : (C extends boolean ? string : C extends object ? string : C);

export interface IFieldClass<TModel extends object> {
    new <TValue>(props: IFieldClassProps<TValue, TModel>): FieldClass<TValue, TModel>;
}

export interface IInputHook<TValue, TModel> {
    name: string;
    value: InputType<TValue>;
    multiple: boolean;
    checked: boolean;
    type: string;
    onFocus: () => any;
    onBlur: () => any;
    onClick: () => any;
    onChange: (value: TValue | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => any;
}

export interface IFieldBase<TValue, TModel extends object> {
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
    isFocus: boolean;

    isValid: boolean;
    /**
     * Rest passed to [[Field]]
     */
    rest: { [key: string]: any };
}

/**
 * Describes props for [[FieldClass]]
 */
export interface IFieldClassProps<TValue, TModel extends object>
    extends IFieldBase<TValue, TModel> {
    value: TValue;
    /**
     * Value passed to [[Field]]
     */
    forwardedValue?: InputType<TValue>;
    /**
     * Field selector from model
     */
    name: (model: TModel) => TValue;
    type: string;
    multiple?: boolean;

    onFocus?: () => any;
    onBlur?: () => any;
    onClick?: () => any;
    onChange?: (value?: TValue | null, nextState?: IFieldState | null) => any;
    /**
     * Accepts `(context: FieldModelContext<TModel>) => React.ReactNode` function or `React.ReactNode`
     * if `children` is `React.ReactNode` then pass [[FieldModelContext]] via FieldContext
     */
    children?: ((context: IFieldContext<TValue, TModel>) => React.ReactNode) | React.ReactNode;
}
/**
 * Describes FieldContext
 */
export interface IFieldContext<TValue, TModel extends object>
    extends IFieldBase<TValue, TModel> {
    value: TValue;
    inputHook: IInputHook<TValue, TModel>;
}

/**
 * Default [[FieldClass]] props and FieldContext value
 */
const defaultProps: Partial<IFieldContext<any, any>> = {
    validationErrors: [],
    validationScope: [],
    rest: {},
    form: {
        model: {}
    } as any
};

export const { Provider, Consumer } = React.createContext<IFieldContext<any, any>>(defaultProps as any);

/**
 * FieldClass React component accepts [[ClassProps]] as props
 */
export class FieldClass<TValue, TModel extends object> extends React.Component<IFieldClassProps<TValue, TModel>> {
    static defaultProps = defaultProps;
    render() {
        const {
            value: _value,
            forwardedValue,
            type,
            multiple,
            name,
            children,
            onBlur,
            onChange,
            onClick,
            onFocus,
            form,
            ...rest
        } = this.props;

        const value = getValue(_value, type, forwardedValue as TValue, multiple);

        const context = {
            ...rest,
            inputHook: {
                name: getPath(name, form.storage.values),
                type,
                value: getInputValue(value, forwardedValue as TValue, type, multiple),
                checked: getInputChecked(value, forwardedValue as TValue, type),
                multiple,
                onChange: this.handleChange,
                onClick: this.onClick,
                onFocus: this.handleFocus(true),
                onBlur: this.handleFocus(false)
            }
        } as IFieldContext<TValue, TModel>;
        return children && typeof children === "function"
            ? children(context)
            : <Provider value={context} children={children} />;
    }

    /**
     * Mount field to form model if passed `value` is `undefined`
     * with empty string `value`
     */
    componentDidMount() {
        this.mountValue();
    }

    componentWillUnmount() {
        this.update(null, null);
    }

    /**
     * Remount field to form model (if passed `value` is `undefined`)
     * with empty string `value`
     */
    componentDidUpdate(prevProps: IFieldClassProps<TValue, TModel>) {
        this.mountValue();
    }

    mountValue() {
        const { value, type, forwardedValue, multiple } = this.props;
        if (value === undefined) {
            this.update(
                getValue(undefined, type, forwardedValue as TValue, multiple) as any,
                {
                    isVisited: false,
                    isChanged: false,
                    isFocus: false
                }
            ); // mount field to form model
        }
    }

    private handleFocus = (type: boolean) => () => {
        const { onBlur, onFocus } = this.props;
        this.update(undefined, { isVisited: true, isFocus: type });
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
            this.update(undefined, { isVisited: true });
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
    private handleChange = (value: TValue | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { type } = this.props;
        let nextValue: string | boolean | string[] | number | TValue;
        if (isSelectChangeEvent(value)) {
            const { value: targetValue, options } = value.target;
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
            nextValue = value as TValue;
        }

        this.update(
            nextValue as TValue,
            {
                isVisited: true,
                isChanged: true
            }
        );
    }

    /**
     * Call [[Form]] `handleChange` with [[IUpdateEvent]] as argument
     * and call [[onChange]] from props
     */
    private update = (nextValue?: TValue | null, nextState?: Partial<IFieldState> | null) => {
        const {
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
        } = this.props;

        const updValue = nextValue === null
            ? null
            : nextValue === undefined
                ? undefined
                : castValue(value, nextValue, type, forwardedValue, multiple);
        const updState: IFieldState | undefined | null = nextState === null
            ? null
            : nextState === undefined
                ? undefined
                : { isVisited, isFocus, isChanged, ...nextState };

        handleChange({
            selector: name as FieldSelector<TModel>,
            value: updValue,
            state: updState
        });

        if (onChange) {
            onChange(updValue, updState);
        }
    }
}

/**
 * Describes [[Field]] props
 */
export interface IFieldProps<TValue, TModel extends object> {
    name: (model: TModel) => TValue;
    value?: InputType<TValue>;
    type?: string;
    multiple?: boolean;
    subscribe?: (formState: IFormStorage<TModel>) => any;
    onClick?: () => any;
    onFocus?: () => any;
    onBlur?: () => any;
    onChange?: (value?: TValue | null, nextState?: IFieldState | null) => any;
    children?: ((context: IFieldContext<TValue, TModel>) => React.ReactNode) | React.ReactNode;
    [key: string]: any;
}

export interface IField<TModel extends object> {
    new <TValue>(props: IFieldProps<TValue, TModel>): Field<TValue, TModel>;
}

/**
 * HOC for [[FieldClass]] that connects [[FormContext]], [[ValidationContext]]
 * and [[TransformContext]] and pass it to [[FieldClass]] as props
 */
export class Field<TValue, TModel extends object> extends React.Component<IFieldProps<TValue, TModel>> {
    static defaultProps = { type: "text" };
    formContext!: IFormContext<TModel>;
    field = React.createRef<FieldClass<TValue, TModel>>();
    render() {
        const { FormContext, ValidationContext, ScopeContext } = createFormFactory<TModel>();
        const {
            value: forwardedValue,
            name,
            type,
            multiple,
            children,
            subscribe,
            onClick,
            onChange,
            onFocus,
            onBlur,
            ...rest
        } = this.props;

        return (
            <ScopeContext>
                {scope => (
                    <FormContext>
                        {formContext => (
                            <ValidationContext>
                                {({ scope: validationScope }) => {
                                    this.formContext = formContext;
                                    let fullRest = rest;
                                    if (subscribe !== undefined) {
                                        fullRest = {
                                            ...fullRest,
                                            ...subscribe(formContext.storage)
                                        };
                                    }
                                    const value = fromProxy(autoCreateProxy(formContext.storage.values), scope(name));
                                    const modelState = fromProxy(
                                        autoCreateProxy(formContext.storage.state),
                                        scope(name as any as FieldStateSelector<TModel>),
                                        {}
                                    );
                                    const errors = fromProxy(
                                        autoCreateProxy(formContext.storage.validation.errors),
                                        scope(name as any as ErrorsSelector),
                                        []
                                    );

                                    const isChanged = modelState.isChanged === true;
                                    const isVisited = modelState.isVisited === true;
                                    const isFocus = modelState.isFocus === true;
                                    const isValid = errors.length === 0;
                                    /*&& (validation.scope === undefined || validation.scope.length === 0)*/

                                    const _Field = FieldClass as IFieldClass<TModel>;
                                    return (
                                        <_Field
                                            name={scope(name)}
                                            type={type as string}
                                            multiple={multiple}
                                            value={value}
                                            forwardedValue={forwardedValue}
                                            validationErrors={errors}
                                            validationScope={validationScope}
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

                                            ref={this.field}
                                        />
                                    );
                                }}
                            </ValidationContext>
                        )}
                    </FormContext>
                )}
            </ScopeContext>
        );
    }

    componentDidMount() {
        if (this.formContext) {
            this.formContext.mountField(this);
        }
    }

    componentWillUnmount() {
        if (this.formContext) {
            this.formContext.unMountField(this);
        }
    }
}
