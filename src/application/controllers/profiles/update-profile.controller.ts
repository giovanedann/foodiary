import { Injectable } from "@kernel/decorators/injectable";

import { Controller } from "@application/contracts/controller";
import { UpdateProfileUseCase } from "@application/use-cases/profiles/update-profile.usecase";
import { Schema } from "@kernel/decorators/schema";
import {
  UpdateProfileBody,
  updateProfileSchema,
} from "./schemas/update-profile.schema";

@Injectable()
@Schema(updateProfileSchema)
export class UpdateProfileController extends Controller<
  "private",
  UpdateProfileController.Response
> {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<"private", UpdateProfileBody>): Promise<
    Controller.Response<UpdateProfileController.Response>
  > {
    const { birthDate, name, gender, height, weight } = body;

    await this.updateProfileUseCase.execute({
      accountId,
      birthDate,
      name,
      gender,
      height,
      weight,
    });

    return {
      statusCode: 204,
    };
  }
}

export namespace UpdateProfileController {
  export type Response = null;
}
