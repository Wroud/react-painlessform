import * as React from "react";
import { isArrayEqual } from "../tools";
import { Consumer as FormContext, IFormState } from "./Form";
import { Consumer as ValidationContext, IValidationContext } from "./Validation";

export interface IFieldProps<T> {
    name: string;
    value?: any;
    formState?: IFormState;
    validationErrors?: string[];
    onClick?: () => any;
    onChange?: (field: string, value) => any;
    children?: ((state: IFieldState) => React.ReactNode) | React.ReactNode;
}

export interface IFieldState {
    name: string;
    value: any;
    validationErrors?: string[];
    isVisited: boolean;
    isValid?: boolean;
    onClick: () => any;
    onChange: (value: any | React.ChangeEvent<HTMLInputElement>) => any;
}

export const { Provider, Consumer } = React.createContext();

export class FieldClass<T> extends React.Component<IFieldProps<T>, IFieldState> {
    private static getDerivedStateFromProps(
        {
            validationErrors: nextErrors,
            value: nextValue,
            name,
        }: IFieldProps<any>,
        {
            value: prevValue,
            validationErrors: prevValidationErrors,
        }: IFieldState,
    ): Partial<IFieldState> {
        let value = prevValue;
        let validationErrors = prevValidationErrors;
        if (value !== nextValue) {
            value = nextValue === undefined ? "" : nextValue;
        }
        if (!isArrayEqual(validationErrors, nextErrors)) {
            validationErrors = nextErrors;
        }
        return {
            value,
            name,
            validationErrors,
            isValid: validationErrors === undefined || validationErrors.length === 0,
        };
    }

    constructor(props: IFieldProps<T>) {
        super(props);

        this.state = {
            value: "",
            name: "",
            isValid: true,
            isVisited: false,
            onClick: this.onClick,
            onChange: this.handleChange,
        };
    }

    render() {
        const { children } = this.props;
        const rChildren = children
            && typeof children === "function"
            ? children(this.state)
            : children;

        return (
            <Provider value={this.state}>
                {rChildren}
            </Provider>
        );
    }

    componentDidMount() {
        this.update(this.state.value); // mount field to form model
    }

    componentDidUpdate(prevProps: IFieldProps<T>, prevState: IFieldState) {
        // const { validator, formState } = this.props;
        // const { name, value } = this.state;
        // if (validator && value !== prevState.value) {
        //     formState.handleValidation(name, validator.validate(value));
        // }
    }

    shouldComponentUpdate(nextProps: IFieldProps<T>, nextState: IFieldState) {
        const { onChange, value: propsValue } = this.props;
        const { value, name, isVisited, isValid, validationErrors } = this.state;
        if (
            onChange !== nextProps.onChange
            || propsValue !== nextProps.value
            || name !== nextState.name
            || value !== nextState.value
            || isVisited !== nextState.isVisited
            || isValid !== nextState.isValid
            || !isArrayEqual(validationErrors, nextState.validationErrors)
        ) {
            return true;
        }
        return false;
    }

    private onClick = () => {
        if (!this.state.isVisited) {
            this.setState({
                isVisited: true,
            });
        }
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    private handleChange = (value: any | React.ChangeEvent<HTMLInputElement>) => {
        let nextValue;
        if (value.target !== undefined) {
            const { type, checked, value: targetValue } = (value as React.ChangeEvent<HTMLInputElement>).target;
            nextValue = type === "checkbox" ? checked : targetValue;
            // const name = !target.name ? target.id : target.name;
        } else {
            nextValue = value;
        }

        if (this.props.onChange) {
            this.props.onChange(this.props.name, nextValue);
        }
        if (this.props.value === undefined) {
            this.setState({ value: nextValue });
        }
        this.update(nextValue);
    }

    private update = value => {
        const { formState, name } = this.props;
        formState.handleChange(name, value);
    }
}

type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export function withFormState(Component) {
    return function FieldComponent<T>(props: Omit<IFieldProps<T>, "formState" | "value" | "validationErrors">) {
        return (
            <FormContext>
                {formState => (
                    <ValidationContext>
                        {validation => (
                            <Component
                                {...props}
                                value={formState.model[props.name]}
                                validationErrors={validation.errors[props.name]}
                                formState={formState}
                            />
                        )}
                    </ValidationContext>
                )}
            </FormContext>
        );
    };
}

export const Field = withFormState(FieldClass);
