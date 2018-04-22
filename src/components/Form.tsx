import * as React from "react";
import shallowequal = require("shallowequal");

import { IValidator } from "../ArrayValidator";
import { FormErrors } from "../FormValidator";
import { getValuesFromModel, resetModel, updateModel, updateModelFields } from "../helpers/form";
import { IFieldState } from "../interfaces/field";
import { FormModel, IFormConfiguration } from "../interfaces/form";
import { mergeFormErrors } from "../tools";

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
    isChanged: boolean;
    isSubmitting: boolean;
    configure?: IFormConfiguration;
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
    validation: {},
};

export const { Provider, Consumer } = React.createContext<IFormState<any>>();
const EmptyModel: FormModel<any> = {};

export class Form<T = {}> extends React.Component<IFormProps<T>, IFormState<T>> {
    static defaultProps: Partial<IFormProps<any>> = {
        configure: defaultConfiguration,
    };

    static getDerivedStateFromProps(props: IFormProps<any>, state: IFormState<any>) {
        const { values, configure } = props;
        let nextState = null;
        const model = props.isReset ? resetModel(state.model) : state.model;

        nextState = {
            model: values ? updateModel(values, state.model) : state.model,
            configure: configure || defaultConfiguration,
        };

        return nextState;
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
        if (
            !shallowequal(this.props, nextProps)
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
            this.setState(({ model }) => {
                const nextModel = resetModel(model);

                // this.callModelChange(nextModel, model);
                return {
                    model: nextModel,
                };
            });
        }
    }

    private handleChange = (field: string, value: IFieldState<T>) => {
        // if (this.props.values) {
        //     const { model } = this.state;
        //     if (model[field] && shallowequal(model[field], value)) {
        //         return;
        //     }
        //     const nextModel: FormModel<T> = {
        //         ...(model as any),
        //         [field]: { ...value },
        //     };
        //     this.callModelChange(nextModel, this.state.model);
        //     return;
        // }

        this.setState((prev, props) => {
            if (prev.model[field] && shallowequal(prev.model[field], value)) {
                return null;
            }
            const nextModel = {
                ...(prev.model as any),
                [field]: { ...value },
            };

            // this.callModelChange(nextModel, prev.model);
            return {
                model: nextModel,
            };
        });
    }
}
