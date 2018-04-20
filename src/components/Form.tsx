import * as React from "react";
import shallowequal = require("shallowequal");
import { IValidator } from "../ArrayValidator";
import { FormErrors } from "../FormValidator";
import { mergeFormErrors } from "../tools";

export interface IFormConfiguration {
    submitting: {
        preventDefault: boolean;
    };
    validation: any;
}

export const defaultConfiguration: IFormConfiguration = {
    submitting: {
        preventDefault: true,
    },
    validation: {},
};

export interface IFormProps<T> extends React.FormHTMLAttributes<HTMLFormElement> {
    values?: Partial<T>;
    configure?: IFormConfiguration;
    onModelChange?: (nextModel: T, prevModel: T) => any;
    onReset?: () => any;
    [rest: string]: any;
}

export interface IFormState<T> {
    model: T;
    isSubmitting: boolean;
    configure?: IFormConfiguration;
    handleReset: () => any;
    handleChange: (field: string, value: any) => any;
}

export interface IForm<T = {}> extends Form<T> {
    new(props: IFormProps<T>): Form<T>;
}

export const { Provider, Consumer } = React.createContext<IFormState<any>>();
const EmptyModel = {};

export class Form<T = {}> extends React.Component<IFormProps<T>, IFormState<T>> {
    static defaultProps: Partial<IFormProps<any>> = {
        configure: defaultConfiguration,
    };
    static getDerivedStateFromProps(props: IFormProps<any>, state: IFormState<any>) {
        const { values, configure } = props;
        let nextState = null;

        nextState = {
            model: values || state.model,
            configure: configure || defaultConfiguration,
        };

        return nextState;
    }

    constructor(props: IFormProps<T>) {
        super(props);

        this.state = {
            model: EmptyModel as T,
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
        if (
            this.props.onModelChange
            && !shallowequal(this.state.model, prevState.model)
        ) {
            this.props.onModelChange(this.state.model, prevState.model);
        }
    }

    render() {
        const {
            componentId,
            children,
            onModelChange,
            onSubmit,
            values,
            actions,
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

    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (event && this.props.configure.submitting.preventDefault) {
            event.preventDefault();
        }
        const { onSubmit } = this.props;
        if (onSubmit) {
            onSubmit(event);
        }
    }

    private handleReset = () => {
        const { onReset } = this.props;
        if (onReset) {
            onReset();
        }
        if (!this.props.values) {
            this.setState({
                model: EmptyModel as T,
            });
        }
    }

    private handleChange = (field: string, value: any) => {
        if (this.props.values) {
            const { model } = this.state;
            if (model[field] === value) {
                return;
            }
            const nextModel = {
                ...(model as any),
                [field]: value,
            };
            this.props.onModelChange(nextModel, this.state.model);
            return;
        }

        this.setState((prev, props) => {
            if (prev.model[field] === value) {
                return null;
            }
            const nextModel = {
                ...(prev.model as any),
                [field]: value,
            };

            return {
                model: nextModel,
            };
        });
    }
}
