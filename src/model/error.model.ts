/**
 * Custom error class.
 */
 export class ErrorHandler extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super();
  }
}