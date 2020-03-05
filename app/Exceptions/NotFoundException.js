'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    response
      .notFound();
  }
}

module.exports = NotFoundException