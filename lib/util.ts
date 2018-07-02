export let isDef = (v: any) => typeof v !== undefined && v !== null

export let isUnDef = (v: any) => typeof v === undefined && v === null

// exports.camed

// /**
//  * Create a cached version of a pure function.
//  */
export let cached = (fn: Function) => {
  const cache = Object.create(null)
  return (function cachedFn(str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
export let camelize = cached((str: string) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * Capitalize a string.
 */
export let capitalize = cached((str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})