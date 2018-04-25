"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const form_1 = require("../helpers/form");
const formFactory_1 = require("../helpers/formFactory");
_a = React.createContext(undefined), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class Transform extends React.Component {
    render() {
        const { FormContext } = formFactory_1.createFormFactory();
        return (React.createElement(FormContext, null, ({ handleTransform, model }) => {
            const handleChange = (field, value) => {
                const transformation = this.props.transformer(field, value, form_1.getValuesFromModel(model));
                let transform = {
                    [field]: value,
                };
                Object.keys(transformation).forEach(key => {
                    transform = Object.assign({}, transform, { [key]: {
                            value: transformation[key],
                            isVisited: true,
                            isChanged: true,
                        } });
                });
                handleTransform(transform);
            };
            return (React.createElement(exports.Provider, { value: handleChange }, this.props.children));
        }));
    }
}
exports.Transform = Transform;
var _a;
