import type { GenerateId } from "../domain/GenerateId";

import { v4 as uuid } from "uuid";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GenerateUUID implements GenerateId {
  generate(): string {
    return uuid();
  }
}
