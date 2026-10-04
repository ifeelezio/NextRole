/** An error whose message is safe to show to the end user. */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}
