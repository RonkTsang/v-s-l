exports.isDef = (v) => typeof v !== undefined && v !== null

exports.isUnDef = (v) => typeof v === undefined && v === null

// exports.camed

// /**
//  * Create a cached version of a pure function.
//  */
let cached = (fn) => {
  const cache = Object.create(null)
  return (function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}

exports.cached = cached

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
exports.camelize = cached((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * Capitalize a string.
 */
exports.capitalize = cached((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})