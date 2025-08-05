import { Injectable } from "@kernel/decorators/injectable";

type CompensationFunction = () => Promise<void>;
type RunFunction<TFnResult> = () => Promise<TFnResult>;

@Injectable()
export class Saga {
  private compensations: CompensationFunction[] = [];

  addCompensation(compensationFn: CompensationFunction): void {
    // Add the compensation function to the beginning of the list (LIFO order)
    this.compensations.unshift(compensationFn);
  }

  async run<T>(fn: RunFunction<T>) {
    try {
      return await fn();
    } catch (error) {
      await this.compensate();
      throw error;
    }
  }

  async compensate(): Promise<void> {
    for await (const compensation of this.compensations) {
      try {
        await compensation();
      } catch (error) {
        console.log("Compensation failed:", error);
      }
    }
  }
}
