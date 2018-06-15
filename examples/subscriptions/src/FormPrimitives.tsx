import * as classnames from "classnames";
import * as React from "react";

const checkErrors = (validationErrors, isVisited, isChanged) => {
    const isErrorVisible = validationErrors.length !== 0 && isVisited && isChanged;
    const classes = classnames("input-group", { error: isErrorVisible });
    return { classes, isErrorVisible };
};

const InputFeedback = ({ errors, hidden }) =>
    hidden
        ? null
        : (
            <div className="input-feedback">
                {errors.map((error, key) => (
                    <span key={key}>{error.message}<br /></span>
                ))}
            </div>
        );

export const TextField = ({
    inputHook,
    rest: { label, placeholder },
    isVisited,
    isChanged,
    validationErrors
}: any) => {
    const { classes, isErrorVisible } = checkErrors(validationErrors, isVisited, isChanged);
    return (
        <div className={classes}>
            <label className="label" htmlFor={inputHook.name}>{label}</label>
            <input className="text-input" placeholder={placeholder} id={inputHook.name} {...inputHook} />
            <InputFeedback errors={validationErrors} hidden={!isErrorVisible} />
        </div>
    );
};

const CheckBox = ({
    inputHook,
    rest: { label },
    isVisited,
    isChanged,
    validationErrors
}) => {
    const { classes, isErrorVisible } = checkErrors(validationErrors, isVisited, isChanged);
    return (
        <div className={classes}>
            <input {...inputHook} id={inputHook.name} />
            <label htmlFor={inputHook.name}>{label}</label>
            <InputFeedback errors={validationErrors} hidden={!isErrorVisible} />
        </div>
    );
};
