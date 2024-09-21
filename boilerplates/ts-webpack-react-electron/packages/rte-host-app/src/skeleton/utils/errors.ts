/**
 * Represents an enhanced `Error`.
 */
export interface EnhancedError extends Error {
  /**
   * The error code, if available.
   */
  code?: number | string;

  /**
   * The request, if available.
   */
  request?: any;

  /**
   * The response, if available.
   */
  response?: any;

  /**
   * The meta data, if available.
   */
  meta?: any;
}

/**
 * Creates an `EnhancedError` object with the specified
 * message, error code, request, response and meta data.
 *
 * @param {string} message The error message.
 * @param {(number | string)} [code] The error code.
 * @param {any} [request] The request.
 * @param {any} [response] The response.
 * @param {any} [meta] The meta data.
 * @returns {Error} The created error.
 */
export function createError(
  message?: string,
  code?: number | string,
  request?: any,
  response?: any,
  meta?: any,
): EnhancedError {
  return enhanceError(new Error(message), code, request, response, meta);
}

/**
 * Enhances an existing `Error` or `EnhancedError` object with the specified
 * error code, request, response and meta data.
 *
 * @param {(Error | EnhancedError)} error The error to enhance.
 * @param {(number | string)} [code] The error code.
 * @param {any} [request] The request.
 * @param {any} [response] The response.
 * @param {any} [meta] The meta data.
 */
export function enhanceError(
  error: Error | EnhancedError,
  code?: number | string,
  request?: any,
  response?: any,
  meta?: any,
): EnhancedError {
  const e: EnhancedError = error;
  if (code !== undefined) {
    e.code = code;
  }

  if (request !== undefined) {
    e.request = request;
  }

  if (response !== undefined) {
    e.response = response;
  }

  if (meta !== undefined) {
    e.meta = meta;
  }
  return e;
}
