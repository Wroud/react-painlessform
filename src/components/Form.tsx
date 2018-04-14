import * as React from "react";
import shallowequal from "shallowequal";
import { FormErrors } from "../FormValidator";
import { mergeFormErrors } from "../tools";
import { IValidator } from "../Validator";

export interface IFormProps<T> extends React.FormHTMLAttributes<HTMLFormElement> {
    values?: Partial<T>;
    onModelChange?: (prevModel: T, nextModel: T) => any;
    onReset?: () => any;
    [rest: string]: any;
}

export interface IFormState {
    model: any;
    isSubmitting: boolean;
    handleReset: () => any;
    handleChange: (field: string, value: any) => any;
}

export const { Provider, Consumer } = React.createContext<IFormState>();
const EmptyModel = {};

export class Form<T = {}> extends React.Component<IFormProps<T>, IFormState> {
    static getDerivedStateFromProps(props: IFormProps<any>, state: IFormState) {
        const { values } = props;
        let nextState = null;

        nextState = {
            model: values ? values : state.model,
        };

        return nextState;
    }

    constructor(props: IFormProps<T>) {
        super(props);

        this.state = {
            model: EmptyModel,
            isSubmitting: false,
            handleReset: this.handleReset,
            handleChange: this.handleChange,
        };
    }

    shouldComponentUpdate(nextProps: IFormProps<T>, nextState: IFormState) {
        const {
            values,
            onModelChange,
            ...rest,
        } = this.props;

        for (const key of Object.keys(rest)) {
            if (rest[key] !== nextProps[key]) {
                return true;
            }
        }

        const {
            model,
            isSubmitting,
            handleChange,
            ...stateRest,
        } = this.state;

        for (const key of Object.keys(stateRest)) {
            if (stateRest[key] !== nextState[key]) {
                return true;
            }
        }
        if (!shallowequal(model, nextState.model)
            || isSubmitting !== nextState.isSubmitting
        ) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps: IFormProps<any>, prevState: IFormState) {
        if (this.props.onModelChange && !shallowequal(this.state.model, prevState.model)) {
            this.props.onModelChange(prevState.model, this.state.model);
        }
    }

    render() {
        const {
            componentId,
            children,
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

    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
                model: EmptyModel,
            });
            return;
        }
    }

    private handleChange = (field: string, value: any) => {
        if (this.props.values) {
            const { model } = this.state;
            if (model[field] === value) {
                return;
            }
            const nextModel = {
                ...model,
                [field]: value,
            };
            this.props.onModelChange(this.state.model, nextModel);
            return;
        }

        this.setState((prev, props) => {
            if (prev.model[field] === value) {
                return null;
            }
            const nextModel = {
                ...prev.model,
                [field]: value,
            };

            return {
                model: nextModel,
            };
        });
    }
}
