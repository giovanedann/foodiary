import { HelloController } from "@application/controllers/hello.controller";
import { HelloUseCase } from "@application/use-cases/hello.usecase";
import { Registry } from "@kernel/di/registry";

export const container = Registry.getInstance();

container.register(HelloUseCase);
container.register(HelloController);
