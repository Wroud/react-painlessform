import * as React from "react";

import { IErrorMessage } from "../FormValidator";
import { Path } from "../Path";
import {
    isInputChangeEvent,
    isSelectChangeEvent
} from "../tools";

import { castValue } from "../helpers/field";
import { getDefaultValue, getInputChecked, getInputValue } from "../helpers/form";
import { createFormFactory } from "../helpers/formFactory";

import { FieldPath, FieldValue, IFieldState, InputValue } from "../interfaces/field";
import { ISubscriptionsMap, Subscriptions, SubscriptionsMap } from "../interfaces/store";

import { IFormContext } from "./Form";

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
    rest: { [key: string]: any } & TSub;
}

/**
 * Describes props for [[FieldClass]]
 */
export interface IFieldClassProps<TValue extends FieldValue, TModel extends object, TSub>
    extends IFieldBase<TValue, TModel, TSub> {

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
export interface IFieldContext<TValue extends FieldValue, TModel extends object, TSub>
    extends IFieldBase<TValue, TModel, TSub> {
    inputHook: IInputHook<TModel>;
    onFocus: () => any;
    onBlur: () => any;
    onClick: () => any;
    onChange: (value?: TValue | null, state?: IFieldState | null) => any;
}

const Unset = undefined;

export const { Provider, Consumer } = React.createContext<IFieldContext<any, any, any> | undefined>(undefined);

/**
 * FieldClass React component accepts [[ClassProps]] as props
 */
export class FieldClass<TValue extends FieldValue, TModel extends object, TSub> extends React.Component<IFieldClassProps<TValue, TModel, TSub>> {
    render() {
        const {
            value: fieldValue,
            type, name, forwardedValue, defaultValue,
            multiple,
            children,
            form,
            ...rest
        } = this.props;

        let inputHook: IInputHook<TModel> = {} as any;
        if (form.storage.config.htmlPrimitives) {
            const value = getDefaultValue(fieldValue || defaultValue, type, multiple);
            inputHook = {
                name: name.getPath(),
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

        const context: IFieldContext<TValue, TModel, TSub> = {
            ...rest,
            name,
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
     * Get `value` from `React.ChangeEvent<HTMLInputElement | HTMLSelectElement>`
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
            nextValue,
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
    private update = (nextValue?: TValue | FieldValue | null, nextState?: Partial<IFieldState> | null) => {
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
        const updState: IFieldState | undefined | null = nextState !== null && nextState !== Unset
            ? { isVisited, isFocus, isChanged, ...nextState }
            : nextState;

        handleChange({
            selector: name,
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
    children?: ((context: IFieldContext<TValue, TModel, SubscriptionsMap<TModel, TSub>>) => React.ReactNode) | React.ReactNode;
    [key: string]: any;
}

export interface IField<TModel extends object> extends Field<any, TModel, any> {
    new <TValue, TSub extends ISubscriptionsMap<TModel>>(props: IFieldProps<TValue, TModel, TSub>): Field<TValue, TModel, TSub>;
}

/**
 * HOC for [[FieldClass]] that connects [[FormContext]], [[ValidationContext]]
 * and [[TransformContext]] and pass it to [[FieldClass]] as props
 */
export class Field<TValue, TModel extends object, TSub extends ISubscriptionsMap<TModel>> extends React.Component<IFieldProps<TValue, TModel, TSub>> {
    static defaultProps = { type: "text" };
    formContext!: IFormContext<TModel>;
    path?: FieldPath<TModel, TValue>;
    field = React.createRef<FieldClass<TValue, TModel, SubscriptionsMap<TModel, TSub>>>();
    subscriptions: Subscriptions<TModel> = [];
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
                                    let fullRest: ({ [x: string]: any } & SubscriptionsMap<TModel, TSub>) = rest as any;
                                    if (subscribe !== undefined) {
                                        fullRest = { ...fullRest as any };
                                        this.subscriptions = [];
                                        Object.keys(subscribe).forEach(key => {
                                            const subscription = scope.join(Path.fromSelector(subscribe[key]));
                                            this.subscriptions.push(subscription);
                                            fullRest[key] = subscription.getValue(formContext.storage.values);
                                        });
                                    }
                                    this.path = scope.join(Path.fromSelector(name)) as FieldPath<TModel, TValue>;
                                    const value = this.path.getValue<TValue>(formContext.storage.values);
                                    const modelState = this.path.getValue(formContext.storage.state, {} as IFieldState);
                                    const errors = this.path.getValue(formContext.storage.validation.errors, [] as Array<IErrorMessage<any>>);

                                    const isChanged = modelState.isChanged === true;
                                    const isVisited = modelState.isVisited === true;
                                    const isFocus = modelState.isFocus === true;
                                    const isValid = errors.length === 0;

                                    const _Field = FieldClass as IFieldClass<TModel>;
                                    return (
                                        <_Field
                                            name={this.path}
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
