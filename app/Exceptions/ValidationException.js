const { LogicalException } = require('@adonisjs/generic-exceptions')

class ValidationException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    const formattedError = {
      code: 'error.invalid.model',
      message: error.message,
    };
    response.badRequest(formattedError);
  }
}

module.exports = ValidationException
