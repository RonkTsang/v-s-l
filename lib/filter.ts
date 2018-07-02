
import {
  camelize
} from './util'


declare type Result = {
  property: string,
  value: string | number
}

export function transformStyle(style: { [s: string]: string }): Result {
  let { property, value } = style
  let res: Result = {
    property: '',
    value: ''
  }

  res.property = camelize(property)
  res.value = value
  return res
}