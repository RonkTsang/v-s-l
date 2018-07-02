"use strict";
exports.__esModule = true;
var StyleDescriptor = (function () {
    function StyleDescriptor(style, scoped_id, state, attrs, children) {
        if (style === void 0) { style = {}; }
        if (scoped_id === void 0) { scoped_id = ''; }
        if (state === void 0) { state = {}; }
        if (attrs === void 0) { attrs = {}; }
        if (children === void 0) { children = []; }
        this.style = style;
        this.scoped_id = scoped_id;
        this.state = state;
        this.attrs = attrs;
        this.children = children;
    }
    return StyleDescriptor;
}());
exports["default"] = StyleDescriptor;
