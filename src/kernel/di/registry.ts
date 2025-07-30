import { Constructor } from "@shared/types/constructor";

export class Registry {
  private static instance: Registry | undefined;
  private readonly providers = new Map<string, Registry.Provider>();

  private constructor() {}

  register(implementation: Constructor) {
    const token = implementation.name;

    if (this.providers.has(token)) {
      throw new Error(`${token} is already registered in registry.`);
    }

    const dependencies =
      Reflect.getMetadata("design:paramtypes", implementation) ?? [];

    this.providers.set(token, { implementation, dependencies });
  }

  resolve<TImplementation extends Constructor>(
    implementation: TImplementation
  ): InstanceType<TImplementation> {
    const token = implementation.name;
    const provider = this.providers.get(token);

    if (!provider) {
      throw new Error(`${token} is not registered in registry.`);
    }

    const dependencies = provider.dependencies.map((dep) => this.resolve(dep));

    return new provider.implementation(...dependencies);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Registry();
    }

    return this.instance;
  }
}

export namespace Registry {
  export type Provider = {
    implementation: Constructor;
    dependencies: Constructor[];
  };
}
