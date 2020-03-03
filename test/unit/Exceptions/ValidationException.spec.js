const { test } = use('Test/Suite')('ValidationException');

const sinon = require('sinon');

const ValidationException = use('App/Exceptions/ValidationException');

test('it should return response badRequest', () => {
  // Given
  const error = {
    message: 'some error message',
  };
  const ctx = {
    response: {
      badRequest: sinon.stub(),
    },
  };
  const validationException = new ValidationException();

  // When
  validationException.handle(error, ctx);

  // Then
  const expectedError = {
    code: 'error.invalid.model',
    message: 'some error message',
  };
  sinon.assert.calledWith(ctx.response.badRequest, expectedError);
});