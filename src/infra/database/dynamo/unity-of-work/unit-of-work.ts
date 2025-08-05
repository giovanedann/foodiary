import {
  PutCommandInput,
  TransactWriteCommand,
  TransactWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";

export abstract class UnitOfWork {
  private transactItems: NonNullable<
    TransactWriteCommandInput["TransactItems"]
  > = [];

  protected addPut(putInput: PutCommandInput) {
    this.transactItems.push({ Put: putInput });
  }

  protected async commit() {
    const transactWriteCommand = new TransactWriteCommand({
      TransactItems: this.transactItems,
    });

    await dynamoClient.send(transactWriteCommand);
  }
}
