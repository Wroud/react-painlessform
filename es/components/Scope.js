"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
_a = React.createContext(s => s), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class Scope extends React.Component {
    render() {
        return (React.createElement(exports.Consumer, null, scope => React.createElement(exports.Provider, { value: s => f => s(scope(this.props.scope)(f)) }, this.props.children)));
    }
}
exports.Scope = Scope;
var _a;
