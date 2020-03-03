const { test } = use('Test/Suite')('GrantService');
const GrantService = use('App/Core/GrantService');
const ForbiddenException = use('App/Exceptions/ForbiddenException');
const NotFoundException = use('App/Exceptions/NotFoundException');

const sinon = require('sinon');


test('it should grant access', ({ assert }) => {
  // Given
  const ref = '111';
  const UserModel = {
    findOne: sinon.stub().withArgs('111').resolves({
      profile: {
        role: 'role',
      },
    }),
  };
  const grantService = new GrantService(UserModel);

  // When
  const grantPromise = grantService.grantOrFail(ref, ['role']);

  // Then
  return assert.isFulfilled(grantPromise);
});

test('it shouldn\'t  grant access user having no sufficent rights', ({ assert }) => {
  // Given
  const ref = '111';
  const UserModel = {
    findOne: sinon.stub().withArgs('111').resolves({
      profile: {
        role: 'role1',
      },
    }),
  };
  const grantService = new GrantService(UserModel);

  // When
  const grantPromise = grantService.grantOrFail(ref, ['role2']);

  // Then
  return assert.isRejected(grantPromise, ForbiddenException);
});

test('it shouldn\'t grant access for user not found', ({ assert }) => {
  // Given
  const ref = '111';
  const UserModel = {
    findOne: sinon.stub(),
  };
  const grantService = new GrantService(UserModel);

  // When
  const grantPromise = grantService.grantOrFail(ref, ['role']);

  // Then
  return assert.isRejected(grantPromise, NotFoundException);
});
