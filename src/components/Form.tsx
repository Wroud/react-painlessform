import deepEqual = require("deep-equal");
import * as React from "react";

import { isDiffEqual, isValueEqual } from "../helpers/field";
import { setModelValues, updateModelFields } from "../helpers/form";

import { IFieldState, InputValue, IUpdateEvent } from "../interfaces/field";
import { FieldsState, IFormConfiguration, IFormStorage } from "../interfaces/form";

import { autoCreateProxy, fromProxy, setPathValue } from "../tools";
import { Field } from "./Field";
import { Transform } from "./Transform";
import { Validation } from "./Validation";

/**
 * Describes [[Form]] props
 */
export interface IFormProps<T extends object> extends React.FormHTMLAttributes<HTMLFormElement> {
    /**
     * Via this prop you can controll form via `Redux` as example
     * if passed you need control `isSubmitting` `isChanged` by yourself
     */
    values?: Partial<T>;
    state?: FieldsState<T>;
    /**
     * Sets inital form values on mount and when reset
     */
    initValues?: Partial<T>;
    initState?: FieldsState<T>;
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
     * Fire when [[Form]] [[model]] changed
     */
    onModelChange?: (nextModel: T, prevModel: T) => any;
    onReset?: (event: React.FormEvent<HTMLFormElement>) => any;
    /**
     * Fire when form submits
     */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => (values: T, isValid: boolean) => any;
    [rest: string]: any;
}

export interface IFormContext<T extends object> {
    storage: IFormStorage<T>;
    /**
     * Reset form to `initValues` and call [[onReset]] from props
     */
    handleReset: () => any;
    /**
     * Update [[model]] [[Field]] state and call [[onModelChange]] from props
     */
    handleChange: (event: IUpdateEvent) => any;
    mountField: (value: Field<any, T>) => any;
    unMountField: (value: Field<any, T>) => any;
}

// export interface IForm<T extends ValuesModel<T>> extends Form<T> {
//     new(props: IFormProps<T>): Form<T>;
// }

/**
 * Default [[Form]] configuration
 */
export const defaultConfiguration: IFormConfiguration = {
    submitting: {
        preventDefault: true
    }
};

const emptyModel = {};

const defaultStorage: IFormStorage<{}> = {
    values: emptyModel,
    state: emptyModel,
    config: defaultConfiguration,
    validation: {
        errors: {},
        scope: [],
        isValid: true
    },
    isChanged: false,
    isSubmitting: false
};

export const { Provider, Consumer } = React.createContext<IFormContext<{}>>({
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
export class Form<T extends object> extends React.Component<IFormProps<T>> {
    static defaultProps: Partial<IFormProps<any>> = {
        config: defaultConfiguration
    };

    private fields: Array<Field<any, T>> = [];
    private transform: React.RefObject<Transform<T>>;
    private validation: React.RefObject<Validation<T>>;
    private storage: IFormStorage<T>;

    constructor(props: IFormProps<T>) {
        super(props);

        const model = props.values || props.initValues || emptyModel;

        this.storage = defaultStorage as any;
        this.storage.values = model as T;
        this.transform = React.createRef<Transform<T>>();
        this.validation = React.createRef<Validation<T>>();
    }
    get getStorage() {
        return this.storage;
    }
    get getFields() {
        return this.fields;
    }
    /**
     * [[Form]] rerenders only if `model` or `props` changed
     */
    shouldComponentUpdate(nextProps: IFormProps<T>) {
        const {
            values,
            initValues,
            config,
            isReset, isChanged, isSubmitting
        } = nextProps;

        this.storage.config = config;

        if (isReset) {
            this.storage.values = initValues
                ? initValues as any
                : {};
            this.storage.state = updateModelFields(
                {
                    isChanged: false,
                    isFocus: false,
                    isVisited: false
                },
                this.storage.state,
                this.fields.map(f => f.props.name)
            );
            this.storage.isChanged = false;
        }
        if (values !== undefined) {
            const { isChanged: isValuesChanged, model } = setModelValues(values, this.storage.values);
            this.storage.values = model as any;
            if (!isReset) {
                this.storage.isChanged = this.storage.isChanged || isValuesChanged;
            }
        }
        this.storage.isChanged = isChanged !== undefined ? isChanged : this.storage.isChanged;
        this.storage.isSubmitting = isSubmitting !== undefined ? isSubmitting : this.storage.isSubmitting;

        return true;
    }

    render() {
        const {
            componentId,
            values,
            initValues,
            actions,
            children,
            config,
            isReset,
            isChanged,
            isSubmitting,
            onModelReset,
            onModelChange,
            onSubmit,
            onReset,
            ...rest
        } = this.props;

        const context: IFormContext<T> = {
            storage: this.storage,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
            mountField: this.mountField,
            unMountField: this.unMountField
        };

        return (
            <Provider value={context}>
                <form onSubmit={this.handleSubmit} onReset={this.handleReset} {...rest}>
                    <Transform ref={this.transform}>
                        <Validation ref={this.validation}>
                            {children}
                        </Validation>
                    </Transform>
                </form>
            </Provider >
        );
    }
    componentDidMount() {
        this.fields.forEach(field => {
            field.field.current.mountValue();
        });
    }
    componentDidCatch(error, info) {

        console.log(error, info);
    }
    private mountField = (value: Field<any, T>) => {
        this.fields.push(value);
    }
    private unMountField = (value: Field<any, T>) => {
        const id = this.fields.indexOf(value);
        if (id > -1) {
            this.fields.splice(id, 1);
        }
    }
    /**
     * Transform `model` to `values` and call `onModelChange`
     */
    private callModelChange(prevModel: T) {
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
        if (event && config.submitting.preventDefault) {
            event.preventDefault();
        }
        this.storage.state = updateModelFields(
            {
                isChanged: false,
                isFocus: false,
                isVisited: true
            },
            this.storage.state,
            this.fields.map(f => f.props.name)
        );
        this.storage.isChanged = false;
        if (onSubmit) {
            onSubmit(event)(this.storage.values, this.storage.validation.isValid);
        }
    }
    /**
     * Reset form to [[initValues]]
     */
    private handleReset = (event?: React.FormEvent<HTMLFormElement>) => {
        const { onReset, values, initValues } = this.props;
        if (onReset) {
            onReset(event);
        }
        // console.log("pp");
        if (!values) {
            this.storage.values = initValues
                ? initValues as any
                : {};
            // console.log(">>", this.storage.state);
            this.storage.state = updateModelFields(
                {
                    isChanged: false,
                    isFocus: false,
                    isVisited: false
                },
                this.storage.state,
                this.fields.map(f => f.props.name)
            );

            this.storage.isChanged = false;
            this.storage.isSubmitting = false;
        }
    }
    private invokeFieldsUpdate() {
        this.fields.forEach(field => field.forceUpdate());
    }
    /**
     * Update [[Field]] state with new `value` and sets form `isChanged` to `true`
     */
    private handleChange = (event: IUpdateEvent) => {
        // console.log(event);
        if (isDiffEqual(event, this.storage)) {
            return null;
        }
        // console.log("upd >>>>>>>>>");
        const prevValues = this.storage.values;
        this.storage.values = { ...prevValues as any };
        this.storage.state = { ...this.storage.state as any };
        if (this.transform.current) {
            const transforms = this.transform.current.transform([event][Symbol.iterator](), this.storage);
            let result: IteratorResult<IUpdateEvent>;
            do {
                result = transforms.next();
                if (!result.value) {
                    break;
                }
                const { selector, value, state } = result.value;
                const prevValue = fromProxy<T, InputValue>(autoCreateProxy(this.storage.values), selector);
                const prevState = fromProxy<FieldsState<T>, IFieldState>(
                    autoCreateProxy(this.storage.state),
                    selector,
                    {}
                );
                // console.log("vals", prevValues);
                // console.log("set: ", value, state);
                setPathValue(selector, this.storage.values, value);
                // console.log(this.storage.values);
                // console.log("prevState: ", prevState, state);
                setPathValue(
                    selector,
                    this.storage.state,
                    {
                        ...prevState,
                        ...state,
                        isChanged: state.isChanged
                            || prevValue !== undefined
                            && !isValueEqual(value, prevValue)
                    });
                // console.log(this.storage.state);
            } while (!result.done);
        }
        this.storage.isChanged = true;
        if (this.validation.current) {
            this.storage.validation = this.validation.current.validate(this.storage.values);
        }

        this.invokeFieldsUpdate();
        this.callModelChange(prevValues);
        // console.log("upd <<<<<<<<<<");
    }
}
