import deepEqual = require("deep-equal");
import * as React from "react";

import { isDiffEqual, isValueEqual } from "../helpers/field";
import { mergeModels, updateFieldsState } from "../helpers/form";
import { createFormFactory } from "../helpers/formFactory";

import { FieldValue, IFieldState, IUpdateEvent } from "../interfaces/field";
import { FieldsState, IFormConfiguration, IFormStorage } from "../interfaces/form";

import { autoCreateProxy, forEachElement, fromProxy, getPath, setPathValue } from "../tools";
import { Field } from "./Field";
import { Transform } from "./Transform";
import { Validation } from "./Validation";
import { Field as CField } from "./Field";
import { ITransform } from "./Transform";
import { IValidation } from "./Validation";

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
    isSubmitting?: boolean;
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

export interface IFormContext<TModel extends object> {
    storage: IFormStorage<TModel>;
    /**
     * Reset form to `initValues` and call [[onReset]] from props
     */
    handleReset: () => any;
    /**
     * Update [[model]] [[Field]] state and call [[onModelChange]] from props
     */
    handleChange: (event: IUpdateEvent<TModel>) => any;
    mountField: (value: CField<any, TModel>) => any;
    unMountField: (value: CField<any, TModel>) => any;
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
    isChanged: false,
    isSubmitting: false
};

export const { Provider, Consumer } = React.createContext<IFormContext<any>>({
    storage: defaultStorage,
    handleReset: () => ({}),
    handleChange: () => ({}),
    mountField: () => ({}),
    unMountField: () => ({})
});

export interface IForm<TModel extends object> extends Form<TModel> {
    new(props: IFormProps<TModel>): Form<TModel>;
}

/**
 * Form component controlls [[Field]]s and passes [[FormContext]]
 */
export class Form<TModel extends object> extends React.Component<IFormProps<TModel>> {
    static defaultProps: Partial<IFormProps<any>> = {
        config: defaultConfiguration
    };

    private fields: Array<CField<any, TModel>> = [];
    private transform: React.RefObject<ITransform<TModel>>;
    private validation: React.RefObject<IValidation<TModel>>;
    private storage: IFormStorage<TModel>;

    constructor(props: IFormProps<TModel>) {
        super(props);

        this.storage = defaultStorage as IFormStorage<any>;
        this.storage.state = props.state || props.initState || {} as FieldsState<TModel>;
        this.storage.values = props.values || props.initValues || {} as TModel;
        this.storage.isChanged = props.isChanged || false;
        this.storage.isSubmitting = props.isSubmitting || false;

        this.transform = React.createRef<ITransform<TModel>>();
        this.validation = React.createRef<IValidation<TModel>>();
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
    shouldComponentUpdate(nextProps: IFormProps<TModel>) {
        const {
            values,
            state,
            config,
            isReset, isChanged, isSubmitting
        } = nextProps;

        this.storage.config = config as any;

        if (isReset) {
            this.resetToInital(values, state);
        } else {
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
        }
        this.storage.validation = {
            errors: {} as any,
            isValid: true
        };
        this.storage.isChanged = isChanged !== undefined ? isChanged : this.storage.isChanged;
        this.storage.isSubmitting = isSubmitting !== undefined ? isSubmitting : this.storage.isSubmitting;
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
            ...rest
        } = this.props;

        const context: IFormContext<TModel> = {
            storage: this.storage,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
            mountField: this.mountField,
            unMountField: this.unMountField
        };
        const { Transform, Validation } = createFormFactory<TModel>();
        return (
            <Provider value={context}>
                <form onSubmit={this.handleSubmit} onReset={this.handleReset} {...rest}>
                    <Transform ref={this.transform}>
                        <Validation ref={this.validation as any}>
                            {children}
                        </Validation>
                    </Transform>
                </form>
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
            this.fields.filter(f => f.field.current !== null).map(f => (f.field.current as any).props.name)
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
        storage.isSubmitting = false;
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
        this.invokeFieldsUpdate();
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
            this.invokeFieldsUpdate();
        }
    }
    private invokeFieldsUpdate() {
        this.fields.forEach(field => field.forceUpdate());
    }
    /**
     * Update [[Field]] state with new `value` and sets form `isChanged` to `true`
     */
    private handleChange = (event: IUpdateEvent<TModel>) => {
        if (isDiffEqual(event, this.storage)) {
            return;
        }
        const updatedFields: string[] = [];
        const prevValues = this.storage.values;
        this.storage.values = { ...prevValues as any };
        this.storage.state = { ...this.storage.state as any };

        const valuesProxy = autoCreateProxy(this.storage.values);

        if (this.transform.current) {
            const transforms = this.transform.current.transform([event][Symbol.iterator](), this.storage);
            const stateProxy = autoCreateProxy(this.storage.state);

            forEachElement(transforms, ({ selector, value, state }) => {
                let newState: IFieldState | null = null;
                if (state !== undefined && state !== null) {
                    const prevValue = fromProxy(valuesProxy, selector) as FieldValue;
                    const prevState = fromProxy(stateProxy, selector, {}) as IFieldState;
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
                        const prevValue = fromProxy(valuesProxy, selector) as FieldValue;
                        const prevState = fromProxy(stateProxy, selector, {}) as IFieldState;
                        newState = {
                            ...prevState,
                            isChanged: prevState.isChanged === true
                                || prevValue !== undefined && !isValueEqual(value, prevValue)
                        };
                    }
                    setPathValue(value, selector, this.storage.values);
                }
                setPathValue(newState, selector, this.storage.state);
                updatedFields.push(getPath(selector, this.storage.values));
            });
        }
        this.storage.isChanged = true;
        this.validate();

        updatedFields.forEach(path1 => {
            this.fields.forEach(field => {
                const fieldClass = field.field.current;
                if (!fieldClass) {
                    return;
                }
                if (path1 === fieldClass.props.path) {
                    field.forceUpdate();
                }
            }
            );
        });
        // this.invokeFieldsUpdate();
        this.callModelChange(prevValues);
    }
    private mountField = (value: CField<any, TModel>) => {
        this.fields.push(value);
    }
    private unMountField = (value: CField<any, TModel>) => {
        const id = this.fields.indexOf(value);
        if (id > -1) {
            this.fields.splice(id, 1);
        }
    }
}
