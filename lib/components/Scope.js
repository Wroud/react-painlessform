"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Path_1 = require("../Path");
_a = React.createContext(Path_1.Path.root()), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class Scope extends React.Component {
    render() {
        return (React.createElement(exports.Consumer, null, scope => React.createElement(exports.Provider, { value: scope.join(Path_1.Path.fromSelector(this.props.name)) }, this.props.children)));
    }
}
exports.Scope = Scope;
var _a;
//# sourceMappingURL=Scope.js.map