"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const form_1 = require("../helpers/form");
_a = React.createContext(undefined), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class Transform extends React.Component {
    constructor() {
        super(...arguments);
        this.transformers = [];
        this.transform = (values, prevModel) => {
            const { transformer } = this.props;
            let model = Object.assign({}, values);
            if (transformer) {
                model = form_1.mergeModels(transformer(model, prevModel), model);
            }
            this.transformers.forEach(({ transform }) => {
                model = form_1.mergeModels(transform(model, prevModel), model);
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
        const context = {
            mountTransform: this.mountTransform,
            unMountTransform: this.unMountTransform
        };
        return (React.createElement(exports.Consumer, null, transform => {
            this._context = transform;
            return React.createElement(exports.Provider, { value: context }, this.props.children);
        }));
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
