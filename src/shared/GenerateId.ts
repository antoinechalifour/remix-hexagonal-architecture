import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";

export interface GenerateId {
  generate(): string;
}

@Injectable()
export class GenerateUUID implements GenerateId {
  generate(): string {
    return uuid();
  }
}
