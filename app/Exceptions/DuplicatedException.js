'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class DuplicatedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    response
      .conflict('Duplicated');
  }
}

module.exports = DuplicatedException
