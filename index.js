var _c = require('consoler')
var css = require('css')

var {
  isDef, isUnDef
} = require('./lib/util')

var StyleDescriptor = require('./lib/styleDescriptor')

const AST_TYPE = {
  STYLESHEET: 'stylesheet',
  RULE: 'rule',
  DECLARATION: 'declaration',
  FONT_FACE: 'font-face',
  IMPORT: 'import',
  KEYFRAME: 'keyframe'
}

const REG_EXP = {
  CLASS: /^\./,
  SELECT_TYPE: /^[\.#]/,
  // [data-v-[hash]]
  SCOPE_ID_FIELD: /\[(data-v-[a-z0-9]+)\]/,
  // data-v-[hash]
  SCOPE_ID: /(?:data-v-[a-z0-9]+)$/,
  // selector: .class[attr]:state  $1: class, $2: attr, $3: state
  SELECTOR: /^(?:\.?([A-Za-z0-9_\-]+))(?:\[([A-Za-z0-9=\-]+)\])?(:[a-z:]+)?$/,
  // selector: .class[attr]:state  $1: class, $2: attr, $3: state
  // SELECTOR: /^(\.?[A-Za-z0-9_\-]+)(?:\[([A-Za-z0-9=\-]+)\])?(:[a-z:]+)$/,
  KEY_VALUE: /^([a-zA-Z]+)=([a-zA-Z0-9]+)$/
}

module.exports = function (code) {
  _c.log('viola-style code', code)

  let cssAST = css.parse(code)

  _c.log('viola-style AST', cssAST)
  
  // return res
  var testStyle = { violaStyle: "red" }
  return 'module.exports = ' + JSON.stringify(walkAST(cssAST), {}, 2)
}

function walkAST(cssAST) {
  if (!cssAST) return
  if (
    cssAST.type === AST_TYPE.STYLESHEET
    && cssAST.stylesheet 
    && cssAST.stylesheet.rules
  ) {
    let sheet = cssAST.stylesheet // 样式表
    let rules = sheet.rules       // rule array
    let styles = {}               // 收集样式
    rules.forEach((rule) => {
      let styleDescription = {}
      if (rule.type === AST_TYPE.RULE) {
        let declarations = rule.declarations
        
        // selector 是选择器，rule.selectors 为数组
        let selector = Array.isArray(rule.selectors) ? rule.selectors[0] : rule.selectors
        let selectorName
        let selectorsPart = selector.split(' ')
        switch (selectorsPart.length) {
          case 1:
            // selectorName = REG_EXP.CLASS.test(selector) ? selector.slice(1) : selector
            selectorName = selector
            break;
          case 2:
            let _name = selectorsPart[1]
            // selectorName = REG_EXP.CLASS.test(selector) ? selector.slice(1) : selector
            selectorName = _name
          default:
            break;
        }

        let {
          className, scoped_id, attr, state, stateArr
        } = getSelectorData(selectorName)
        
        _c.log('getSelectorData', {
          selectorName,
          className, scoped_id, attr, state, stateArr
        })
        
        let cur = styles[className] || (styles[className] = new StyleDescriptor()), target
        cur.scoped_id = scoped_id
        if (cur && attr[0]) {
          let key = attr[0]
          let _targetAttr = cur.attrs[key] || (cur.attrs[key] = {})
          // target = attr[1]
          //   ? (cur[attr[0]] && cur[attr[0]][attr[1]]) || ((cur[attr[0]] = {}) && (cur[attr[0]][attr[1]] = {}))
          //   : cur[attr[0]] || (cur[attr[0]] = {})
          target = attr[1] 
            ? (_targetAttr[attr[1]] || (_targetAttr[attr[1]] = {}))
            : _targetAttr
        } else {
          target = cur.style
        }
        
        declarations.reduce((result, style) => {
          // todo: property , value filter(transform)
          result[style.property + state] = style.value
          return result
        }, target)
      }
    })
    return styles
  }
}

function getSelectorData(selector) {
  let selectorData = {
    className: null,
    scoped_id: '',
    attr: [],
    state: '',
    stateArr: [],
  }
  selector = selector.replace(REG_EXP.SCOPE_ID_FIELD, (match, $1) => {
    selectorData.scoped_id = $1
    return ''
  })
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa ', selector)
  let matchResult = REG_EXP.SELECTOR.exec(selector)
  if (matchResult) {
    // class
    selectorData.className = matchResult[1]
    let attr = matchResult[2]
    if (attr) {
      // [data-v-hash]
      if (REG_EXP.SCOPE_ID.test(attr)) {
        selectorData.scoped_id = attr
      } else {
        // attr: [key, vaule]
        // ['type', 'number']
        // ['disable']
        selectorData.attr = attr.split('=')
        // isDef(selectorData.attr[2]) || (selectorData.attr[2] = true)
        // selectorData[attrKeyVaule[0]] = isDef(attrKeyVaule[1]) ? attrKeyVaule[1] : true
      } 
    }
    if (matchResult[3]) {
      // state: ':hover:active'
      selectorData.state = matchResult[3]
      // stateArr: ['hover', 'active']
      selectorData.stateArr = selectorData.state.slice(1).split(':')
    }
  }
  return selectorData
}

function sliceScopedId(selector) {
  let id = ''
  return selector.replace(REG_EXP.SCOPE_ID_FIELD, (input, $1) => {
    id = $1
    return ''
  })
  return {
    selector, scoped_id: id
  }
}

/* 

viola style rule: {
  className : {
    scoped: 'data-v-hash'
    style: { ...styles },
    attrs: {
      attr: { ...style }
    },
    state: {
      hover: { ...style },
      active: { ...style }
    },
    children: []
  }
}

*/