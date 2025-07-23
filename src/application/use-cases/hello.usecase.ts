export class HelloUseCase {
  async execute(input: HelloUseCase.Input): Promise<HelloUseCase.Output> {
    return {
      hello: input.email,
    };
  }
}

export namespace HelloUseCase {
  export type Input = {
    email: string;
  }

  export type Output = {
    hello: string
  }
}
