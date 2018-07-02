"use strict";
exports.__esModule = true;
exports.isDef = function (v) { return typeof v !== undefined && v !== null; };
exports.isUnDef = function (v) { return typeof v === undefined && v === null; };
exports.cached = function (fn) {
    var cache = Object.create(null);
    return (function cachedFn(str) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
};
var camelizeRE = /-(\w)/g;
exports.camelize = exports.cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; });
});
exports.capitalize = exports.cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
