import { Injectable } from "@kernel/decorators/injectable";
import { env } from "./env";

@Injectable()
export class AppConfig {
  public readonly auth: AppConfig.Auth;
  public readonly database: AppConfig.Database;
  public readonly storage: AppConfig.Storage;

  constructor() {
    this.auth = {
      cognito: {
        client: {
          id: env.COGNITO_CLIENT_ID,
          secret: env.COGNITO_CLIENT_SECRET,
        },
        pool: {
          id: env.COGNITO_USER_POOL_ID,
        },
      },
    };

    this.database = {
      dynamodb: {
        mainTableName: env.DYNAMO_DB_MAIN_TABLE_NAME,
      },
    };

    this.storage = {
      s3: {
        mealsBucket: env.MEALS_BUCKET,
      },
    };
  }
}

export namespace AppConfig {
  export type Auth = {
    cognito: {
      client: {
        id: string;
        secret: string;
      };
      pool: {
        id: string;
      };
    };
  };

  export type Database = {
    dynamodb: {
      mainTableName: string;
    };
  };

  export type Storage = {
    s3: {
      mealsBucket: string;
    };
  };
}
