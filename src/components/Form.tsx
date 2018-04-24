import * as React from "react";
import shallowequal = require("shallowequal");

import { getValuesFromModel, resetModel, updateModel, updateModelFields } from "../helpers/form";
import { IFieldState } from "../interfaces/field";
import { FormModel, IFormConfiguration } from "../interfaces/form";

export interface IFormProps<T> extends React.FormHTMLAttributes<HTMLFormElement> {
    values?: Partial<T>;
    configure?: IFormConfiguration;
    isReset?: boolean;
    isChanged?: boolean;
    isSubmitting?: boolean;
    onModelChange?: (nextModel: T, prevModel: T) => any;
    onReset?: () => any;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => (values: T) => any;
    [rest: string]: any;
}

export interface IFormState<T> {
    model: FormModel<T>;
    configure?: IFormConfiguration;
    isChanged: boolean;
    isSubmitting: boolean;
    handleReset: () => any;
    handleChange: (field: string, value: IFieldState<any>) => any;
}

export interface IForm<T = {}> extends Form<T> {
    new(props: IFormProps<T>): Form<T>;
}

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
});

export class Form<T = {}> extends React.Component<IFormProps<T>, IFormState<T>> {
    static defaultProps: Partial<IFormProps<any>> = {
        configure: defaultConfiguration,
    };
    static getDerivedStateFromProps(props: IFormProps<any>, state: IFormState<any>) {
        const { values, configure } = props;
        const model = props.isReset ? resetModel(state.model) : state.model;

        return {
            model: values ? updateModel(values, model) : model,
            configure,
        };
    }
    constructor(props: IFormProps<T>) {
        super(props);

        this.state = {
            model: EmptyModel as any,
            isChanged: false,
            isSubmitting: false,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
        };
    }
    shouldComponentUpdate(nextProps: IFormProps<T>, nextState: IFormState<T>) {
        const { model, ...rest } = this.state;
        const { model: nextModel, ...nextRest } = nextState;
        const { children, ...props } = this.props;
        const { children: _, ...nnextProps } = nextProps;

        if (
            !shallowequal(props, nnextProps)
            || !shallowequal(model, nextModel)
            || !shallowequal(rest, nextRest)
        ) {
            return true;
        }
        return false;
    }
    componentDidUpdate(prevProps: IFormProps<any>, prevState: IFormState<T>) {
        this.callModelChange(this.state.model, prevState.model);
    }
    render() {
        const {
            componentId,
            values,
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
    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (event && this.props.configure.submitting.preventDefault) {
            event.preventDefault();
        }
        const { onSubmit } = this.props;
        this.setState(state => ({
            model: updateModelFields(
                {
                    isChanged: false,
                    isVisited: true,
                },
                state.model,
            ),
        }));
        if (onSubmit) {
            onSubmit(event)(getValuesFromModel(this.state.model));
        }
    }
    private handleReset = () => {
        const { onReset } = this.props;
        if (onReset) {
            onReset();
        }
        if (!this.props.values) {
            this.setState(({ model }) => ({
                model: resetModel(model),
            }));
        }
    }
    private handleChange = (field: string, value: IFieldState<T>) => {
        this.setState(prev => {
            if (prev.model[field] && shallowequal(prev.model[field], value)) {
                return null;
            }

            return {
                model: {
                    ...(prev.model as any),
                    [field]: { ...value },
                },
            };
        });
    }
}
