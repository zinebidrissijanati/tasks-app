const { test } = use('Test/Suite')('Models/User');
const User = use('App/Models/User');

test('User should be instanciate when schema is valid', async ({ assert }) => {
    const user = new User();
    user.name = 'zineb';
    user.ref = '111';
    user.profile.role='admin'
    user.createdAt = Date.now();
    user.createdBy = '222'
    const error = await user.validateSync();
    assert.isUndefined(error);
  });

  test('User should not be instanciate when schema is failing', async ({ assert }) => {
    const user = new User();
    user.profile = {role: 'undefined'};
    const error = await user.validateSync();
    assert.isOk(error.errors.ref);
    assert.isOk(error.errors.name);
    assert.isOk(error.errors.createdAt);
    assert.isOk(error.errors.createdBy);
    assert.include(error.errors['profile.role'].message, 'is not a valid enum value for path `profile.role`.');

});