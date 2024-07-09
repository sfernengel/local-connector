export interface ErrorDetail {
  code: string;
  message: string;
  localizedMessage?: string;
  extensionExtraInfo?: any;
}

export class CustomError extends Error {
  statusCode: number;
  errors: ErrorDetail[];

  constructor(statusCode: number, errors: ErrorDetail[]) {
    super(errors[0]?.message); // Set the main error message to the first error's message
    this.statusCode = statusCode;
    this.errors = errors;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    // Set the prototype explicitly
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      errors: this.errors,
    };
  }
}

export default CustomError;
