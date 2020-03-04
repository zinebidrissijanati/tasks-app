const { test } = use('Test/Suite')('UserAggregate');
const sinon = require('sinon');


const UserAggregate = use('App/Core/UserAggregate');
const ValidationException = use('App/Exceptions/ValidationException');
const DuplicatedException = use('App/Exceptions/DuplicatedException');
const NotFoundException = use('App/Exceptions/NotFoundException');

const requiredUserCrudRoles = [
  'admin',
  'user_1',
];

test('it should let user get it\'s own data', async ({ assert }) => {
  // Given
  const user = { ref: '111', name: 'zineb' };
  const UserModel = {
    findOne: sinon
      .stub()
      .resolves(user),
  };

  const performedBy = { ref: '111' };
  const GrantService = {
    grantOrFail: sinon.stub(),
  };
  const userAggregate = new UserAggregate(UserModel, GrantService);

  // When
  const foundUser = await userAggregate.getOneByRef('111', performedBy);

  // Then
  sinon.assert.notCalled(GrantService.grantOrFail);
  sinon.assert.calledWith(UserModel.findOne, { ref: '111' });

  assert.deepEqual(foundUser, user);
});

test('it should get a user by ref', async ({ assert }) => {
  // Given
  const user = { ref: '111', name: 'zineb' };
  const UserModel = {
    findOne: sinon
      .stub()
      .resolves(user),
  };

  const performedBy = { ref: '222' };
  const GrantService = {
    grantOrFail: sinon.stub(),
  };
  const userAggregate = new UserAggregate(UserModel, GrantService);

  // When
  const foundUser = await userAggregate.getOneByRef('111', performedBy);

  // Then
  sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
  sinon.assert.calledWith(UserModel.findOne, { ref: '111' });

  assert.deepEqual(foundUser, user);
});
test('it should throw notfound when user is not found', async ({ assert }) => {
  // Given
  const UserModel = {
    findOne: sinon
      .stub()
      .resolves(),
  };

  const performedBy = { ref: '222' };
  const GrantService = {
    grantOrFail: sinon.stub(),
  };
  const userAggregate = new UserAggregate(UserModel, GrantService);

  // When
  const getUserPromise = userAggregate.getOneByRef('111', performedBy);

  // Then
  await assert.isRejected(getUserPromise, NotFoundException);
  sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
  sinon.assert.calledWith(UserModel.findOne, { ref: '111' });
});
test('it should get a users paginated', async ({ assert }) => {
  // Given
  const users = [{ ref: '111', name: 'zineb' }];
  const limit = sinon.stub().resolves(users);
  const skip = sinon.stub().returns({ limit });
  const UserModel = {
    find: sinon
      .stub()
      .returns({ skip }),
  };

  const performedBy = { ref: '222' };
  const GrantService = {
    grantOrFail: sinon.stub(),
  };
  const userAggregate = new UserAggregate(UserModel, GrantService);
  const pagination = { page: 2, perPage: 15 };

  // When
  const foundUsers = await userAggregate.getUsers(pagination, performedBy);

  // Then
  sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
  sinon.assert.calledWith(skip, 15);
  sinon.assert.calledWith(limit, 15);
  assert.deepEqual(foundUsers, users);
});
test('it should delete a user by ref', async () => {
  // Given
  const UserModel = {
    deleteOne: sinon
      .stub()
      .resolves(),
  };
  const performedBy = { ref: '222' };
  const GrantService = {
    grantOrFail: sinon.stub(),
  };
  const userAggregate = new UserAggregate(UserModel, GrantService);

  // When
  await userAggregate.deleteOneByRef('111', performedBy);

  // Then
  sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
  sinon.assert.calledWith(UserModel.deleteOne, { ref: '111' });
});
test('it should create a user', async ({ assert }) => {
  // Given
  //why use callsFake and not stub
  const UserModel = {
    create: sinon
      .stub()
      .callsFake((c) => c),
  };
  const performedBy = { ref: '222' };
  const GrantService = {
    grantOrFail: sinon.stub(),
  };
  const userAggregate = new UserAggregate(UserModel, GrantService);
  const payload = {
    ref: '111',
    name: 'zineb',
    createdBy: '222',
    profile: {
      role: 'admin',
    },
  };
  const now = new Date();

  // When
  const createdUser = await userAggregate.create(payload, performedBy);

  // Then
  sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
  sinon.assert.called(UserModel.create);
  assert.equal(createdUser.name, 'zineb');
  assert.equal(createdUser.createdBy, performedBy.ref);
  assert.equalDate(createdUser.createdAt, now);
});
test('it should update a user', async ({ assert }) => {
  // Given
  const save = sinon.stub();
  const user = {
    ref: '111',
    name: 'zineb',
    createdBy: '222',
    profile: {
      role: 'admin',
    },
    save,
  };
  const UserModel = {
    findOne: sinon
      .stub()
      .resolves(user),
  };
  const performedBy = { ref: '222' };
  const GrantService = {
    grantOrFail: sinon.stub(),
  };
  const userAggregate = new UserAggregate(UserModel, GrantService);
  const payload = {
    ref: '111',
    name: 'zaynab',
  };

  // When
  const updatedUser = await userAggregate.update(payload, performedBy);

  // Then
  sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
  sinon.assert.calledWith(UserModel.findOne, { ref: '111' });
  sinon.assert.called(save);
  assert.equal(updatedUser.name, 'zaynab');
});
test('it should update a user without modifying date', async ({ assert }) => {
    // Given
    const save = sinon.stub();
    const createdAt = new Date();
  
    const user = {
      ref: '111',
      name: 'zineb',
      createdBy: '222',
      createdAt,
      profile: {
        role: 'SUPER_ADMINISTRATOR',
      },
      save,
    };
    const UserModel = {
      findOne: sinon
        .stub()
        .resolves(user),
    };
    const performedBy = { ref: '222' };
    const GrantService = {
      grantOrFail: sinon.stub(),
    };
    const userAggregate = new UserAggregate(UserModel, GrantService);
    const date = new Date('December 17, 1995 03:24:00');
    const payload = {
      ref: '111',
      name: 'zaynab',
      createdAt: date,
    };
  
    // When
    const updatedUser = await userAggregate.update(payload, performedBy);
  
    // Then
    sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
    sinon.assert.calledWith(UserModel.findOne, { ref: '111' });
    sinon.assert.called(save);
    assert.equal(updatedUser.createdAt.toString(), createdAt.toString());
});

test('it should update a user without modifying created by', async ({ assert }) => {
    // Given
    const save = sinon.stub();
    const createdBy = '222';
  
    const user = {
      ref: '111',
      name: 'zineb',
      createdBy,
      createdAt: new Date(),
      profile: {
        role: 'admin',
      },
      save,
    };
    const UserModel = {
      findOne: sinon
        .stub()
        .resolves(user),
    };
    const performedBy = { ref: '222' };
    const GrantService = {
      grantOrFail: sinon.stub(),
    };
    const userAggregate = new UserAggregate(UserModel, GrantService);
    const updatedCreatedBy = '000';
    const payload = {
      ref: '111',
      name: 'zaynab',
      createdBy: updatedCreatedBy,
    };
  
    // When
    const updatedUser = await userAggregate.update(payload, performedBy);
  
    // Then
    sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
    sinon.assert.calledWith(UserModel.findOne, { ref: '111' });
    sinon.assert.called(save);
    assert.equal(updatedUser.createdBy, createdBy);
 });
test('it should throw duplicated when a user already exists', async ({ assert }) => {
  // Given
  const UserModel = {
    create: sinon
      .stub()
      .throws('duplicate', 'duplicate message'),
  };
  const performedBy = { ref: '222' };
  const GrantService = {
    grantOrFail: sinon.stub(),
  };
  const userAggregate = new UserAggregate(UserModel, GrantService);
  const payload = {
    ref: '111',
    name: 'zineb',
    createdBy: '222',
    profile: {
      role: 'admin',
    },
  };

  // When
  const userCreationPromise = userAggregate.create(payload, performedBy);

  // Then
  sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
  await assert.isRejected(userCreationPromise, DuplicatedException);
  sinon.assert.called(UserModel.create);
});
test('it should throw any error when create fails', async ({ assert }) => {
  // Given
  const UserModel = {
    create: sinon
      .stub()
      .throws('SomeError'),
  };
  const performedBy = { ref: '222' };
  const GrantService = {
    grantOrFail: sinon.stub(),
  };
  const userAggregate = new UserAggregate(UserModel, GrantService);
  const payload = {
    ref: '111',
    name: 'zineb',
    profile: {
      role: 'admin',
    },
  };

  // When
  const userCreationPromise = userAggregate.create(payload, performedBy);

  // Then
  sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
  await assert.isRejected(userCreationPromise, Error);
  sinon.assert.called(UserModel.create);
});
test('it should throw bad request when user attributes are not ok', async ({ assert }) => {
  // Given
  const UserModel = {};
  const performedBy = { ref: '222' };
  const GrantService = {
    grantOrFail: sinon.stub(),
  };
  const userAggregate = new UserAggregate(UserModel, GrantService);
  const payload = {
    ref: '111',
    profile: {
      role: 'admin',
    },
  };

  // When
  const userCreationPromise = userAggregate.create(payload, performedBy);

  // Then
  sinon.assert.calledWith(GrantService.grantOrFail, '222', requiredUserCrudRoles);
  return assert.isRejected(userCreationPromise, ValidationException);
});

