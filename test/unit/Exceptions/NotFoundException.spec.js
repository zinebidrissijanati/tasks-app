const { test } = use('Test/Suite')('NotFoundException');

const sinon = require('sinon');

const NotFoundException = use('App/Exceptions/NotFoundException');

test('it should return response not found', () => {
  // Given
  const error = {
    message: 'some error message',
  };
  const ctx = {
    response: {
      notFound: sinon.stub(),
    },
  };
  const notFoundException = new NotFoundException();

  // When
  notFoundException.handle(error, ctx);

  // Then
  sinon.assert.called(ctx.response.notFound);
});