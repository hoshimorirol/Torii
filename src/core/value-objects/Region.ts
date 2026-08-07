export class Region {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly parentRegion?: string,
    public readonly isCustom: boolean = false
  ) {}
}