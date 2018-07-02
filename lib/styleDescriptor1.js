class StyleDescriptor {
  constructor (
    style = {},
    scoped_id = '',
    state = {},
    attrs = {},
    children = []
  ) {
    this.style = style
    this.scoped_id = scoped_id
    this.state = state
    this.attrs = attrs
    this.children = children
  }
}

module.exports = StyleDescriptor