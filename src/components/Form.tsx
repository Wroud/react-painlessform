import * as React from "react";
import shallowequal = require("shallowequal");

import { getMapsFromModel, getValuesFromModel, mergeModels, resetModel, setModelValues, updateModelFields } from "../helpers/form";
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
    onReset?: () => any;
    /**
     * Fire when form submits
     */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => (values: T, isValid: boolean) => any;
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
    isChanged: boolean;
    isSubmitting: boolean;
}
export interface IFormContext<T> extends IFormState<T> {
    configure?: IFormConfiguration;
    /**
     * Reset form to `initValues` and call [[onReset]] from props
     */
    handleReset: () => any;
    /**
     * Update [[model]] [[Field]] state and call [[onModelChange]] from props
     */
    handleChange: (field: keyof T, value: IFieldState<T[typeof field]>) => any;
}

export interface IForm<T = {}> extends Form<T> {
    new(props: IFormProps<T>): Form<T>;
}

/**
 * Default [[Form]] configuration
 */
export const defaultConfiguration: IFormConfiguration = {
    submitting: {
        preventDefault: true
    }
};

const emptyModel: FormModel<any> = {};

export const { Provider, Consumer } = React.createContext<IFormContext<any>>({
    model: emptyModel,
    configure: defaultConfiguration,
    isChanged: false,
    isSubmitting: false,
    handleReset: () => ({}),
    handleChange: () => ({})
});

/**
 * Form component controlls [[Field]]s and passes [[FormContext]]
 */
export class Form<T = {}> extends React.Component<IFormProps<T>, IFormState<T>> {
    static defaultProps: Partial<IFormProps<any>> = {
        configure: defaultConfiguration
    };
    static getDerivedStateFromProps(props: IFormProps<any>, state: IFormState<any>) {
        const { values, isChanged, isSubmitting } = props;
        const model = props.isReset ? resetModel(state.model) : state.model;

        return {
            model: values
                ? setModelValues(values, model)
                : model,
            isChanged: isChanged !== undefined ? isChanged : state.isChanged,
            isSubmitting: isSubmitting !== undefined ? isSubmitting : state.isSubmitting
        };
    }

    private transform: React.RefObject<Transform<T>>;
    private validation: React.RefObject<Validation<T>>;

    constructor(props: IFormProps<T>) {
        super(props);

        const model = props.initValues
            ? setModelValues(
                props.initValues as T,
                emptyModel as FormModel<T>,
                { isChanged: false, isVisited: false }
            )
            : emptyModel as FormModel<T>;
        this.state = {
            model,
            isChanged: false,
            isSubmitting: false
        };
        this.transform = React.createRef<Transform<T>>();
        this.validation = React.createRef<Validation<T>>();
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
            ...rest
        } = this.props;

        const context: IFormContext<T> = {
            ...this.state,
            configure,
            handleReset: this.handleReset,
            handleChange: this.handleChange
        };

        return (
            <Provider value={context}>
                <form onSubmit={this.handleSubmit} {...rest}>
                    <Transform ref={this.transform}>
                        <Validation ref={this.validation}>
                            {children}
                        </Validation>
                    </Transform>
                </form>
            </Provider>
        );
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
        this.setState(({ model }) => ({
            model: updateModelFields(
                {
                    isChanged: false,
                    isVisited: true
                },
                model
            ),
            isChanged: false
        }));
        if (onSubmit) {
            onSubmit(event)(getValuesFromModel(this.state.model), this.validation.current.cacheErrors.isValid);
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
            this.setState(({ model }, { initValues }) => ({
                model: initValues
                    ? setModelValues(initValues as T, emptyModel as FormModel<T>)
                    : resetModel(model),
                isChanged: false,
                isSubmitting: false
            }));
        }
    }
    /**
     * Update [[Field]] state with new `value` and sets form `isChanged` to `true`
     */
    private handleChange = (field: keyof T, value: IFieldState<T[typeof field]>) => {
        this.setState(({ model: prevModel }) => {
            if (prevModel[field] && shallowequal(prevModel[field], { ...prevModel[field] as any, ...value })) {
                return null;
            }
            const model = this.transform.current.transform({ [field]: value } as any, prevModel);

            return {
                model: mergeModels(
                    model, prevModel,
                    ({ value: _value, isChanged: _isChanged }, { value: prevValue, isChanged }) =>
                        ({ isChanged: (isChanged || _isChanged) || prevValue !== undefined && _value !== prevValue })
                ),
                isChanged: true
            };
        });
    }
}
