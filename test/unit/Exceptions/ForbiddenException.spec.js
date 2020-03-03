const { test } = use('Test/Suite')('DuplicatedException');

const sinon = require('sinon');

const ForbiddenException = use('App/Exceptions/ForbiddenException');

test('it should return response forbidden', () => {
  // Given
  const error = {};
  const ctx = {
    response: {
      forbidden: sinon.stub(),
    },
  };
  const forbiddenException = new ForbiddenException();

  // When
  forbiddenException.handle(error, ctx);

  // Then
  sinon.assert.called(ctx.response.forbidden);
});