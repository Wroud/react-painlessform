import * as React from "react";

import { IErrorMessage } from "../FormValidator";
import {
    autoCreateProxy,
    fromProxy,
    getPath,
    isInputChangeEvent,
    isSelectChangeEvent
} from "../tools";

import { castValue } from "../helpers/field";
import { getDefaultValue, getInputChecked, getInputValue } from "../helpers/form";
import { createFormFactory } from "../helpers/formFactory";

import { FieldSelector, FieldStateSelector, FieldValue, IFieldState, InputValue } from "../interfaces/field";
import { IFormStorage } from "../interfaces/form";
import { ErrorsSelector } from "../interfaces/validation";

import { IFormContext } from "./Form";

export interface IFieldClass<TModel extends object> {
    new <TValue>(props: IFieldClassProps<TValue, TModel>): FieldClass<TValue, TModel>;
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

export interface IFieldBase<TValue, TModel extends object> {
    name: (model: TModel) => TValue;
    value: TValue;
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
    rest: { [key: string]: any };
}

/**
 * Describes props for [[FieldClass]]
 */
export interface IFieldClassProps<TValue, TModel extends object>
    extends IFieldBase<TValue, TModel> {
    path: string;

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
    inputHook: IInputHook<TModel>;
    onFocus: () => any;
    onBlur: () => any;
    onClick: () => any;
    onChange: (value?: TValue | null, state?: IFieldState | null) => any;
}

const Unset = undefined;

export const { Provider, Consumer } = React.createContext<IFieldContext<any, any> | undefined>(undefined);

/**
 * FieldClass React component accepts [[ClassProps]] as props
 */
export class FieldClass<TValue, TModel extends object> extends React.Component<IFieldClassProps<TValue, TModel>> {
    render() {
        const {
            value: fieldValue,
            type, path, forwardedValue, defaultValue,
            multiple,
            children,
            form,
            ...rest
        } = this.props;

        let inputHook: IInputHook<TModel> = {} as any;
        if (form.storage.config.htmlPrimitives) {
            const value = getDefaultValue(fieldValue || defaultValue, type, multiple);
            inputHook = {
                name: path,
                type,
                value: getInputValue(value, type, forwardedValue, multiple),
                checked: getInputChecked(value, type, forwardedValue),
                multiple,
                onChange: this.handleHTMLInputChange,
                onClick: this.onClick,
                onFocus: this.handleFocus(true),
                onBlur: this.handleFocus(false)
            };
            }

        const context: IFieldContext<TValue, TModel> = {
            ...rest,
            value: fieldValue,
            defaultValue,
            forwardedValue,
            type,
            multiple,
            form,
            inputHook,
            onClick: this.onClick,
            onFocus: this.handleFocus(true),
            onBlur: this.handleFocus(false),
            onChange: this.handleChange
        };
        return children && typeof children === "function"
            ? children(context)
            : <Provider value={context} children={children} />;
    }
    componentDidUpdate() { this.mountValue(); }
    componentDidMount() { this.mountValue(); }
    componentWillUnmount() { this.update(null, null); }
    mountValue() {
        const { value, type, multiple, defaultValue } = this.props;
        if (value === Unset) {
            this.update(
                getDefaultValue(defaultValue || Unset, type, multiple),
                {
                    isVisited: false,
                    isChanged: false,
                    isFocus: false
                }
            );
        }
    }
    private handleFocus = (type: boolean) => () => {
        const { onBlur, onFocus } = this.props;
        this.update(Unset, { isVisited: true, isFocus: type });
        if (type && onFocus) {
            onFocus();
        }
        if (!type && onBlur) {
            onBlur();
        }
    }
    /**
     * Call [[setVisited]] and [[onClick]]
     */
    private onClick = () => {
        if (!this.props.isVisited) {
            this.update(Unset, { isVisited: true });
        }
        if (this.props.onClick) {
            this.props.onClick();
        }
    }
    /**
     * Get `value` from `React.ChangeEvent<HTMLInputElement>` or pass as it is
     * set `isVisited` & `isChanged` to `true`
     */
    private handleHTMLInputChange = (value: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, state?: IFieldState | null) => {
        const { type } = this.props;
        let nextValue: FieldValue | undefined;
        if (isSelectChangeEvent(value)) {
            const { value: targetValue, options } = value.target;
            if (!this.props.multiple) {
                nextValue = targetValue;
            } else {
                nextValue = [];
                for (let i = 0, l = options.length; i < l; i++) {
                    if (options[i].selected) {
                        (nextValue as string[]).push(options[i].value);
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
        }

        this.update(
            nextValue as TValue,
            state !== undefined
                ? state
                : {
                isVisited: true,
                isChanged: true
            }
        );
    }
    private handleChange = (value?: TValue | null, state?: IFieldState | null) => {
        this.update(
            value,
            state !== undefined
                ? state
                : {
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

        const updValue = nextValue !== null && nextValue !== Unset
            ? castValue(value, nextValue, type, forwardedValue, multiple)
            : nextValue;
        const updState = nextState !== null && nextState !== Unset
            ? { isVisited, isFocus, isChanged, ...nextState } as IFieldState
            : nextState;

        handleChange({
            selector: name as FieldSelector<TModel>,
            value: updValue,
            state: updState
        });

        if (onChange) {
            onChange(updValue as TValue, updState);
        }
    }
}

/**
 * Describes [[Field]] props
 */
export interface IFieldProps<TValue, TModel extends object> {
    name: (model: TModel) => TValue;
    value?: InputValue;
    defaultValue?: TValue;
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

export interface IField<TModel extends object> extends Field<any, TModel> {
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
            defaultValue,
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
                                    const scopedName = scope(name);
                                    const path = getPath(scopedName, formContext.storage.values);
                                    const value = fromProxy(autoCreateProxy(formContext.storage.values), scopedName);
                                    const modelState = fromProxy(
                                        autoCreateProxy(formContext.storage.state),
                                        scopedName as any as FieldStateSelector<TModel>,
                                        {}
                                    );
                                    const errors = fromProxy(
                                        autoCreateProxy(formContext.storage.validation.errors),
                                        scopedName as any as ErrorsSelector,
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
                                            name={scopedName}
                                            path={path}
                                            type={type as string}
                                            multiple={multiple}
                                            value={value}
                                            defaultValue={defaultValue}
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
