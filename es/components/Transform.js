"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const formFactory_1 = require("../helpers/formFactory");
_a = React.createContext(undefined), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class Transform extends React.Component {
    constructor() {
        super(...arguments);
        this.transformers = [];
        this.transform = (values, prevModel) => {
            let model = Object.assign({}, values);
            model = Object.assign({}, model, this.props.transformer(model, prevModel));
            this.transformers.forEach(transformer => {
                model = Object.assign({}, model, transformer.transform(model, prevModel));
            });
            return model;
        };
        this.mountTransform = (value) => {
            this.transformers.push(value);
        };
        this.unMountTransform = (value) => {
            const id = this.transformers.indexOf(value);
            if (id > -1) {
                this.transformers.slice(id, 1);
            }
        };
    }
    render() {
        const { FormContext } = formFactory_1.createFormFactory();
        return (React.createElement(exports.Consumer, null, trenasform => (React.createElement(FormContext, null, form => {
            const context = {
                mountTransform: this.mountTransform,
                unMountTransform: this.unMountTransform,
            };
            this._context = trenasform || form;
            return (React.createElement(exports.Provider, { value: context }, this.props.children));
        }))));
    }
    componentDidMount() {
        if (this._context) {
            this._context.mountTransform(this);
        }
    }
    componentWillUnmount() {
        if (this._context) {
            this._context.unMountTransform(this);
        }
    }
}
exports.Transform = Transform;
var _a;
