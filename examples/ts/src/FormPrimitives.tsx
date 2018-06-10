import * as React from "react";

export const TextField = ({ inputHook, rest: { label, placeholder } }: any) => (
    <div className={"input-group"}>
        <label className="label" htmlFor={inputHook.name}>{label}</label>
        <input className="text-input" placeholder={placeholder} id={inputHook.name} {...inputHook} />
    </div>
);

export const CheckBox = ({ inputHook, rest: { label } }: any) => (
    <div className={"input-group"}>
        <input {...inputHook} id={inputHook.name} />
        <label htmlFor={inputHook.name}>{label}</label>
    </div>
);
