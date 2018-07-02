class StyleDescriptor {
  constructor(
    public style: { [s: string] : string | number } = {},
    public scoped_id: string = '',
    public state: { [s: string]: any } = {},
    public attrs: any = {},
    public children: any = []
  ) {}
}

export default StyleDescriptor