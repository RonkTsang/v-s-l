"use strict";
exports.__esModule = true;
var _c = require('consoler');
var css = require('css');
var filter_1 = require("./lib/filter");
var styleDescriptor_1 = require("./lib/styleDescriptor");
var REG_EXP = {
    CLASS: /^\./,
    SELECT_TYPE: /^[\.#]/,
    SCOPE_ID_FIELD: /\[(data-v-[a-z0-9]+)\]/,
    SCOPE_ID: /(?:data-v-[a-z0-9]+)$/,
    SELECTOR: /^(?:\.?([A-Za-z0-9_\-]+))(?:\[([A-Za-z0-9=\-]+)\])?(:[a-z:]+)?$/,
    KEY_VALUE: /^([a-zA-Z]+)=([a-zA-Z0-9]+)$/
};
module.exports = function (code) {
    _c.log('viola-style code', code);
    var cssAST = css.parse(code);
    _c.log('viola-style AST', cssAST);
    var testStyle = { violaStyle: "red" };
    return 'module.exports = ' + JSON.stringify(walkAST(cssAST), null, 2);
};
function walkAST(cssAST) {
    if (!cssAST)
        return;
    if (cssAST.type === "stylesheet"
        && cssAST.stylesheet
        && cssAST.stylesheet.rules) {
        var sheet = cssAST.stylesheet;
        var rules = sheet.rules;
        var styles_1 = {};
        rules.forEach(function (rule) {
            var styleDescription = {};
            if (rule.type === "rule") {
                var declarations = rule.declarations;
                var selector = Array.isArray(rule.selectors) ? rule.selectors[0] : rule.selectors;
                var selectorName = void 0;
                var selectorsPart = selector.split(' ');
                var length_1 = selectorsPart.length;
                switch (length_1) {
                    case 1:
                        selectorName = selector;
                        break;
                    case 2:
                        var _name = selectorsPart[length_1 - 1];
                        selectorName = _name;
                    default:
                        break;
                }
                var _a = getSelectorData(selectorName), className = _a.className, scoped_id = _a.scoped_id, attr = _a.attr, state_1 = _a.state, stateArr = _a.stateArr;
                _c.log('getSelectorData', {
                    selectorName: selectorName,
                    className: className, scoped_id: scoped_id, attr: attr, state: state_1, stateArr: stateArr
                });
                var cur = styles_1[className] || (styles_1[className] = new styleDescriptor_1["default"]()), target = void 0;
                cur.scoped_id = scoped_id;
                if (cur && attr[0]) {
                    var key = attr[0];
                    var _targetAttr = cur.attrs[key] || (cur.attrs[key] = {});
                    target = attr[1]
                        ? (_targetAttr[attr[1]] || (_targetAttr[attr[1]] = {}))
                        : _targetAttr;
                }
                else {
                    target = cur.style;
                }
                declarations.reduce(function (result, style) {
                    var res = filter_1.transformStyle(style);
                    result[res.property + state_1] = res.value;
                    return result;
                }, target);
            }
        });
        return styles_1;
    }
}
function getSelectorData(selector) {
    var selectorData = {
        className: '',
        scoped_id: '',
        attr: [],
        state: '',
        stateArr: []
    };
    selector = selector.replace(REG_EXP.SCOPE_ID_FIELD, function (match, $1) {
        selectorData.scoped_id = $1;
        return '';
    });
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa ', selector);
    var matchResult = REG_EXP.SELECTOR.exec(selector);
    if (matchResult) {
        selectorData.className = matchResult[1];
        var attr = matchResult[2];
        if (attr) {
            if (REG_EXP.SCOPE_ID.test(attr)) {
                selectorData.scoped_id = attr;
            }
            else {
                selectorData.attr = attr.split('=');
            }
        }
        if (matchResult[3]) {
            selectorData.state = matchResult[3];
            selectorData.stateArr = selectorData.state.slice(1).split(':');
        }
    }
    return selectorData;
}
function sliceScopedId(selector) {
    var id = '';
    return selector.replace(REG_EXP.SCOPE_ID_FIELD, function (input, $1) {
        id = $1;
        return '';
    });
}
