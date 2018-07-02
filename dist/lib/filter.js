"use strict";
exports.__esModule = true;
var util_1 = require("./util");
function transformStyle(style) {
    var property = style.property, value = style.value;
    var res = {
        property: '',
        value: ''
    };
    res.property = util_1.camelize(property);
    res.value = value;
    return res;
}
exports.transformStyle = transformStyle;
