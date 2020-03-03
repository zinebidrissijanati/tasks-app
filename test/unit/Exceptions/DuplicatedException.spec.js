const { test } = use('Test/Suite')('DuplicatedException');

const sinon = require('sinon');

const DuplicatedException = use('App/Exceptions/DuplicatedException');

test('it should return response conflict with Duplicated as text', () => {
  // Given
  const error = {};
  const ctx = {
    response: {
      conflict: sinon.stub(),
    },
  };
  const duplicatedException = new DuplicatedException();

  // When
  duplicatedException.handle(error, ctx);

  // Then
  sinon.assert.calledWith(ctx.response.conflict, 'Duplicated');
});