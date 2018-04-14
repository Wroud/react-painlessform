import * as React from "react";
import { isArrayEqual } from "../tools";
import { Consumer as FormContext, IFormState } from "./Form";
import { Consumer as ValidationContext, IValidationState } from "./Validation";

export interface IFieldState {
    name: string;
    value: any;
    validationErrors?: string[] | undefined;
    isVisited: boolean;
    isValid?: boolean;
    onClick: () => any;
    onChange: (value: any) => any;
}

export interface IFieldProps<T> {
    name: string;
    value?: any;
    formState: IFormState;
    validationErrors?: string[] | undefined;
    onClick?: () => any;
    onChange?: (field: string, value: any) => any;
    children?: (state: IFieldState) => React.ReactNode | React.ReactNode;
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
        if (prevValue !== nextValue) {
            value = nextValue === undefined ? "" : nextValue;
        }
        if (!isArrayEqual(prevValidationErrors, nextErrors)) {
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
        this.update(this.state.value);
    }

    componentDidUpdate(prevProps: IFieldProps<T>, prevState: IFieldState) {
        // const { validator, formState } = this.props;
        // const { name, value } = this.state;
        // if (validator && value !== prevState.value) {
        //     formState.handleValidation(name, validator.validate(value));
        // }
    }

    shouldComponentUpdate(nextProps: IFieldProps<T>, nextState: IFieldState) {
        if (this.props.name !== nextProps.name
            || !isArrayEqual(this.props.validationErrors, nextProps.validationErrors)
            || this.props.onChange !== nextProps.onChange
            || this.props.name !== nextProps.name
            || this.props.value !== nextProps.value
            || this.state.isValid !== nextState.isValid
            || this.state.isVisited !== nextState.isVisited
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

    private handleChange = (value: any) => {
        if (
            value !== undefined
            && value.target !== undefined
            && value.target.value !== undefined
        ) {
            const target = value.target;
            value = target.type === "checkbox" ? target.checked : target.value;
            // const name = !target.name ? target.id : target.name;
        }

        if (this.props.onChange) {
            this.props.onChange(this.props.name, value);
        }
        this.setState({ value });
        this.update(value);
    }

    private update = (value: any) => {
        const { formState } = this.props;
        this.props.formState.handleChange(this.props.name, value);
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
