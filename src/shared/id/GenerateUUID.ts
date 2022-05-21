import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import { GenerateId } from "./GenerateId";

@Injectable()
export class GenerateUUID implements GenerateId {
  generate(): string {
    return uuid();
  }
}
