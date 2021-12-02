/**
 * Custom error class.
 */
 export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super();
  }
}