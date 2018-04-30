import * as React from "react";
import shallowequal = require("shallowequal");

import { getMapsFromModel, getValuesFromModel, mergeModels, resetModel, updateModel, updateModelFields } from "../helpers/form";
import { IFieldState } from "../interfaces/field";
import { FormModel, IFormConfiguration } from "../interfaces/form";
import { Transform } from "./Transform";
import { Validation } from "./Validation";

/**
 * Describes [[Form]] props
 */
export interface IFormProps<T> extends React.FormHTMLAttributes<HTMLFormElement> {
    /**
     * Via this prop you can controll form via `Redux` as example
     * if passed you need control `isSubmitting` `isChanged` by yourself
     */
    values?: Partial<T>;
    /**
     * Sets inital form values on mount and when reset
     */
    initValues?: Partial<T>;
    /**
     * That prop allows you configure form
     */
    configure?: IFormConfiguration;
    /**
     * If `true` form will be reset and sets passed `values`
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
    onReset?: () => any;
    /**
     * Fire when form submits
     */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => (values: T) => any;
    [rest: string]: any;
}

/**
 * Describes [[Form]] state and [[FormContext]]
 */
export interface IFormState<T> {
    /**
     * Current form values and [[Field]] flags
     */
    model: FormModel<T>;
    /**
     * Derived from props
     */
    configure?: IFormConfiguration;
    isChanged: boolean;
    isSubmitting: boolean;
    /**
     * Reset form to `initValues` and call [[onReset]] from props
     */
    handleReset: () => any;
    /**
     * Update [[model]] [[Field]] state and call [[onModelChange]] from props
     */
    handleChange: (field: keyof T, value: IFieldState<T[typeof field]>) => any;
    mountTransform: (transformer: Transform<T>) => any;
    unMountTransform: (transformer: Transform<T>) => any;
}

export interface IForm<T = {}> extends Form<T> {
    new(props: IFormProps<T>): Form<T>;
}

/**
 * Default [[Form]] configuration
 */
export const defaultConfiguration: IFormConfiguration = {
    submitting: {
        preventDefault: true,
    },
};

const EmptyModel: FormModel<any> = {};

export const { Provider, Consumer } = React.createContext<IFormState<any>>({
    model: EmptyModel,
    configure: defaultConfiguration,
    handleReset: () => ({}),
    handleChange: () => ({}),
    mountTransform: () => ({}),
    unMountTransform: () => ({}),
});

/**
 * Form component controlls [[Field]]s and passes [[FormContext]]
 */
export class Form<T = {}> extends React.Component<IFormProps<T>, IFormState<T>> {
    static defaultProps: Partial<IFormProps<any>> = {
        configure: defaultConfiguration,
    };
    static getDerivedStateFromProps(props: IFormProps<any>, state: IFormState<any>) {
        const { values, initValues, configure, isChanged, isSubmitting } = props;
        const model = props.isReset ? resetModel(state.model) : state.model;

        return {
            model: values
                ? updateModel(values, model)
                : model,
            configure,
            isChanged: isChanged !== undefined ? isChanged : state.isChanged,
            isSubmitting: isSubmitting !== undefined ? isSubmitting : state.isSubmitting,
        };
    }

    private transformers: Array<Transform<T>> = [];

    constructor(props: IFormProps<T>) {
        super(props);

        this.state = {
            model: props.initValues ? updateModel(props.initValues, EmptyModel) : EmptyModel as any,
            isChanged: false,
            isSubmitting: false,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
            mountTransform: this.mountTransform,
            unMountTransform: this.unMountTransform,
        };
    }
    /**
     * [[Form]] rerenders only if `model` or `props` changed
     */
    shouldComponentUpdate(nextProps: IFormProps<T>, nextState: IFormState<T>) {
        const { model, ...rest } = this.state;
        const { model: nextModel, ...nextRest } = nextState;
        const { children, ...props } = this.props;
        const { children: _, ...nnextProps } = nextProps;

        const maps = getMapsFromModel(model);
        const _maps = getMapsFromModel(nextModel);

        if (
            !shallowequal(props, nnextProps)
            || !shallowequal(maps.values, _maps.values)
            || !shallowequal(maps.isChanged, _maps.isChanged)
            || !shallowequal(maps.isVisited, _maps.isVisited)
            || !shallowequal(rest, nextRest)
        ) {
            return true;
        }
        return false;
    }
    /**
     * After form did rerendered call [[onModelChange]] from props
     */
    componentDidUpdate(prevProps: IFormProps<any>, prevState: IFormState<T>) {
        this.callModelChange(this.state.model, prevState.model);
    }
    render() {
        const {
            componentId,
            values,
            initValues,
            actions,
            children,
            configure,
            isReset,
            isChanged,
            isSubmitting,
            onModelReset,
            onModelChange,
            onSubmit,
            ...rest,
        } = this.props;

        return (
            <Provider value={this.state}>
                <form onSubmit={this.handleSubmit} {...rest}>
                    {children}
                </form>
            </Provider>
        );
    }
    private mountTransform = (value: Transform<T>) => {
        this.transformers.push(value);
    }
    private unMountTransform = (value: Transform<T>) => {
        const id = this.transformers.indexOf(value);
        if (id > -1) {
            this.transformers.slice(id, 1);
        }
    }
    /**
     * Transform `model` to `values` and call `onModelChange`
     */
    private callModelChange(model: FormModel<T>, prevModel: FormModel<T>) {
        if (!this.props.onModelChange) {
            return;
        }
        const values = getValuesFromModel(model);
        const prevValues = getValuesFromModel(prevModel);
        if (!shallowequal(values, prevValues)) {
            this.props.onModelChange(values, prevValues);
        }
    }
    /**
     * Handles form submitting and `preventDefault` if
     * `configure.submitting.preventDefault` === true
     * sets all [[Field]]s `isChanged` to `false` and `isVisited` to `true`
     * and fires [[onSubmit]] from props
     */
    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const { onSubmit, configure } = this.props;
        if (event && configure.submitting.preventDefault) {
            event.preventDefault();
        }
        this.setState(state => ({
            model: updateModelFields(
                {
                    isChanged: false,
                    isVisited: true,
                },
                state.model,
            ),
            isChanged: false,
        }));
        if (onSubmit) {
            onSubmit(event)(getValuesFromModel(this.state.model));
        }
    }
    /**
     * Reset form to [[initValues]]
     */
    private handleReset = () => {
        const { onReset, values } = this.props;
        if (onReset) {
            onReset();
        }
        if (!values) {
            this.setState(({ model }, props) => ({
                model: props.initValues
                    ? updateModel(props.initValues as T, EmptyModel as FormModel<T>)
                    : resetModel(model),
                isChanged: false,
                isSubmitting: false,
            }));
        }
    }
    /**
     * Update [[Field]] state with new `value` and sets form `isChanged` to `true`
     */
    private handleChange = (field: keyof T, value: IFieldState<T[typeof field]>) => {
        this.setState(prev => {
            if (prev.model[field] && shallowequal(prev.model[field], value)) {
                return null;
            }
            const prevModel = prev.model;
            let model: Partial<FormModel<T>> = { [field]: value } as any;
            this.transformers.forEach(transformer => {
                model = {
                    ...model as any,
                    ...transformer.transform(model, prevModel) as any,
                };
            });

            return {
                model: mergeModels(
                    model, prev.model,
                    ({ value: _value }, { value: prevValue }) =>
                        ({ isChanged: prevValue !== undefined && _value !== prevValue }),
                ),
                isChanged: true,
            };
        });
    }
}
