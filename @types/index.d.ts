declare class StyleDescriptor {
  constructor(
    style: { [s: string]: string | number },
    scoped_id: string,
    state: { [s: string]: any },
    attrs: any,
    children: any
  )
}

declare type StyleDescriptorMap = {
  [s: string]: StyleDescriptor
}