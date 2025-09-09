export class ResponseError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}
