import type { GenerateId } from "shared";

export class GenerateTestId implements GenerateId {
  private count = 0;

  constructor(private prefix: string) {}

  generate(): string {
    this.count += 1;

    return `${this.prefix}/${this.count}`;
  }
}
