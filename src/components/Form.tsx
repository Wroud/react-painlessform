import deepEqual = require("deep-equal");
import * as React from "react";

import { isDiffEqual, isValueEqual } from "../helpers/field";
import { mergeModels, updateFieldsState } from "../helpers/form";
import { createFormFactory } from "../helpers/formFactory";

import { FieldPath, FieldValue, IFieldState, IUpdateEvent, UpdateValue } from "../interfaces/field";
import { FieldsState, IFormConfiguration, IFormStorage } from "../interfaces/form";

import { Path } from "../Path";
import { forEachElement } from "../tools";

import { Field as CField } from "./Field";
import { ISubscribe } from "./Subscribe";
import { ITranformProps, ITransform } from "./Transform";
import { IValidation, IValidationProps } from "./Validation";

/**
 * Describes [[Form]] props
 */
export interface IFormProps<TModel extends object> extends React.FormHTMLAttributes<HTMLFormElement> {
    /**
     * You can control form by yourself by passing `values` and `state`
     * Must be passed with `isSubmitting` `isChanged` props
     */
    values?: TModel;
    state?: FieldsState<TModel>;
    /**
     * Sets inital form values when mount and reset
     */
    initValues?: TModel;
    initState?: FieldsState<TModel>;
    /**
     * That prop allows you configure form
     */
    config?: IFormConfiguration;
    /**
     * If `true` form will be first reset and after sets passed `values`
     * example when you need set new values you want to reset all `isChanged`, `isVisited`
     * [[Field]] props to `false`
     */
    isReset?: boolean;
    isChanged?: boolean;
    /**
     * Fire when [[Form]] changed
     */
    onModelChange?: (nextModel: TModel, prevModel: TModel) => any;
    onReset?: (event?: React.FormEvent<HTMLFormElement>) => any;
    /**
     * Fire when form submitting
     */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => (values: TModel, isValid: boolean) => any;
    [rest: string]: any;
}

export type FormProps<TModel extends object> = IFormProps<TModel> & IValidationProps<TModel> & ITranformProps<TModel>;

export interface IFormContext<TModel extends object> {
    storage: IFormStorage<TModel>;
    /**
     * Reset form to `initValues` and call [[onReset]] from props
     */
    handleReset: () => any;
    /**
     * Update [[model]] [[Field]] state and call [[onModelChange]] from props
     */
    handleChange: (event: IUpdateEvent<TModel, UpdateValue>) => any;
    mountField: (value: CField<any, TModel, any>) => any;
    unMountField: (value: CField<any, TModel, any>) => any;
}

/**
 * Default [[Form]] configuration
 */
export const defaultConfiguration: IFormConfiguration = {
    htmlPrimitives: true,
    submitting: {
        preventDefault: true
    }
};

const defaultStorage: IFormStorage<{}> = {
    values: {},
    state: {},
    config: defaultConfiguration,
    validation: {
        errors: {},
        isValid: true
    },
    isChanged: false
};

export const { Provider, Consumer } = React.createContext<IFormContext<any>>({
    storage: defaultStorage,
    handleReset: () => ({}),
    handleChange: () => ({}),
    mountField: () => ({}),
    unMountField: () => ({})
});

export interface IForm<TModel extends object> extends Form<TModel> {
    new(props: FormProps<TModel>): Form<TModel>;
}

/**
 * Form component controlls [[Field]]s and passes [[FormContext]]
 */
export class Form<TModel extends object> extends React.Component<FormProps<TModel>> {
    static defaultProps: Partial<FormProps<any>> = {
        config: defaultConfiguration
    };

    private fields: Array<CField<any, TModel, any>> = [];
    private transform: React.RefObject<ITransform<TModel>>;
    private validation: React.RefObject<IValidation<TModel>>;
    private subscribers: React.RefObject<ISubscribe<TModel>>;
    private storage: IFormStorage<TModel>;

    constructor(props: FormProps<TModel>) {
        super(props);

        this.storage = defaultStorage as IFormStorage<any>;
        this.storage.state = props.state || props.initState || {} as FieldsState<TModel>;
        this.storage.values = props.values || props.initValues || {} as TModel;
        this.storage.isChanged = props.isChanged || false;

        this.transform = React.createRef<ITransform<TModel>>();
        this.validation = React.createRef<IValidation<TModel>>();
        this.subscribers = React.createRef<ISubscribe<TModel>>();
    }
    get getStorage() {
        return this.storage;
    }
    get getFields() {
        return this.fields;
    }
    /**
     * [[Form]] update [[storage]]
     */
    shouldComponentUpdate(nextProps: FormProps<TModel>) {
        const {
            values,
            initValues,
            state,
            initState,
            config,
            isReset, isChanged
        } = nextProps;

        this.storage.config = config as any;

        if (isReset) {
            this.resetToInital(values || initValues, state || initState);
            return true;
        }
        if (values !== undefined) {
            const { isChanged: isValuesChanged, model: newValues } = mergeModels(values, this.storage.values);
            this.storage.values = newValues;
            this.storage.isChanged = this.storage.isChanged || isValuesChanged;
        }
        if (state !== undefined) {
            const { isChanged: isStateChanged, model: newState } = mergeModels(state, this.storage.state);
            this.storage.state = newState;
            this.storage.isChanged = this.storage.isChanged || isStateChanged;
        }
        this.storage.validation = {
            errors: {} as any,
            isValid: true
        };
        this.storage.isChanged = isChanged !== undefined ? isChanged : this.storage.isChanged;
        return true;
    }

    render() {
        const {
            componentId,
            actions,
            values,
            state,
            initValues,
            initState,
            children,
            config,
            isReset,
            isChanged,
            isSubmitting,
            onModelChange,
            onSubmit,
            onReset,

            errors,
            isValid,
            validator,
            configure,

            transformer,

            ...rest
        } = this.props;

        const context: IFormContext<TModel> = {
            storage: this.storage,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
            mountField: this.mountField,
            unMountField: this.unMountField
        };
        const { Subscribe, Transform, Validation } = createFormFactory<TModel>();
        return (
            <Provider value={context}>
                <Subscribe ref={this.subscribers}>
                    <form onSubmit={this.handleSubmit} onReset={this.handleReset} {...rest}>
                        <Transform ref={this.transform} transformer={transformer} {...rest}>
                            <Validation ref={this.validation as any} validator={validator} isValid={isValid} errors={errors} configure={configure} {...rest}>
                                {children}
                            </Validation>
                        </Transform>
                    </form>
                </Subscribe>
            </Provider >
        );
    }
    componentDidMount() {
        this.fields.forEach(field => {
            if (field.field.current) {
                field.field.current.mountValue();
            }
        });
    }
    private validate() {
        if (this.validation.current) {
            this.storage.validation = {
                errors: {} as any,
                isValid: true
            };
            this.validation.current.smartValidate(this.storage);
        }
    }
    private updateState(state: Partial<IFieldState>) {
        this.storage.state = updateFieldsState(
            state,
            this.storage.state,
            this.fields
                .filter(f => f.field.current !== null)
                .map(f => f.path as Path<FieldsState<TModel>, IFieldState>)
        );
    }
    private resetToInital(initalValues?: TModel, initalState?: FieldsState<TModel>) {
        const { storage, props: { initValues, initState } } = this;

        storage.values = initalValues || initValues || {} as any;

        if (initalState || initState) {
            storage.state = initalState || initState as FieldsState<TModel>;
        } else {
            this.updateState({
                isChanged: false,
                isFocus: false,
                isVisited: false
            });
        }
        this.storage.validation = {
            errors: {} as any,
            isValid: true
        };
        storage.isChanged = false;
    }
    /**
     * Transform `model` to `values` and call `onModelChange`
     */
    private callModelChange(prevModel: TModel) {
        if (!this.props.onModelChange) {
            return;
        }
        const { values } = this.storage;
        if (!deepEqual(values, prevModel)) {
            this.props.onModelChange(values, prevModel);
        }
    }
    /**
     * Handles form submitting and `preventDefault` if
     * `configure.submitting.preventDefault` === true
     * sets all [[Field]]s `isChanged` to `false` and `isVisited` to `true`
     * and fires [[onSubmit]] from props
     */
    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const { onSubmit, config } = this.props;
        if (event && (config as any).submitting.preventDefault) {
            event.preventDefault();
        }
        this.validate();
        if (this.storage.validation.isValid) {
            this.updateState({
                isChanged: false,
                isFocus: false,
                isVisited: false
            });
            this.storage.isChanged = false;
        } else {
            this.updateState({
                isChanged: true,
                isVisited: true
            });
        }
        this.smartUpdate();
        if (onSubmit) {
            onSubmit(event)(this.storage.values, this.storage.validation.isValid);
        }
    }
    /**
     * Reset form to [[initValues]]
     */
    private handleReset = (event?: React.FormEvent<HTMLFormElement>) => {
        const { onReset, values } = this.props;
        if (onReset) {
            onReset(event);
        }
        if (!values) {
            this.resetToInital();
            this.smartUpdate();
        }
    }
    private smartUpdate() {
        this.storage.validation = {
            errors: {} as any,
            isValid: true
        };
        this.forceUpdate();
    }
    /**
     * Update [[Field]] state with new `value` and sets form `isChanged` to `true`
     */
    private handleChange = (event: IUpdateEvent<TModel, UpdateValue>) => {
        if (isDiffEqual(event, this.storage)) {
            return;
        }
        const updatedFields: Array<FieldPath<TModel, any>> = [];
        const prevValues = this.storage.values;
        this.storage.values = { ...prevValues as any };
        this.storage.state = { ...this.storage.state as any };

        if (this.transform.current) {
            const transforms = this.transform.current.transform([event][Symbol.iterator](), this.storage);

            forEachElement(transforms, ({ selector, value, state }) => {
                let newState: IFieldState | null = null;
                if (state !== undefined && state !== null) {
                    const prevValue = selector.getValue<FieldValue>(this.storage.values);
                    const prevState = selector.getValue(this.storage.state, {} as IFieldState);
                    newState = {
                        ...prevState,
                        ...state,
                        isChanged: prevState.isChanged === true
                            || state.isChanged === true
                            || prevValue !== undefined && value !== undefined && !isValueEqual(value, prevValue)
                    };
                }
                if (value !== undefined) {
                    if (state === undefined) {
                        const prevValue = selector.getValue<FieldValue>(this.storage.values);
                        const prevState = selector.getValue(this.storage.state, {} as IFieldState);
                        newState = {
                            ...prevState,
                            isChanged: prevState.isChanged === true
                                || prevValue !== undefined && !isValueEqual(value, prevValue)
                        };
                    }
                    selector.setValueImmutable(this.storage.values, value);
                }
                selector.setValueImmutable(this.storage.state, newState);
                updatedFields.push(selector);
            });
        }
        this.storage.isChanged = true;
        this.validate();

        if (this.subscribers.current) {
            this.subscribers.current.smartUpdate(updatedFields);
        }
        this.callModelChange(prevValues);
    }
    private mountField = (value: CField<any, TModel, any>) => {
        this.fields.push(value);
    }
    private unMountField = (value: CField<any, TModel, any>) => {
        const id = this.fields.indexOf(value);
        if (id > -1) {
            this.fields.splice(id, 1);
        }
    }
}
