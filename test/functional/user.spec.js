/* eslint-disable no-underscore-dangle */
const {
    test, trait, beforeEach, timeout,
  } = use('Test/Suite')('User');
  
  const {
    getUser, createUser, clearUsers, deleteUser, getUsers, injectAdmin,
  } = require('./user-fixtures');
  // ?
  timeout(20000000);
  
  trait('Test/ApiClient');
  
  beforeEach(async () => {
    await clearUsers();
    await injectAdmin('222');
  });
  
  
  test('it should create a user', async ({ assert, client }) => {
    // Given
    const user = {
      name: 'user',
      ref: '111',
      profile: {
        role: 'admin',
      },
    };
    const dateJustBeforeCreatingUser = new Date();
  
    // When
    const response = await createUser(client, user);
  
    // Then
    response.assertStatus(201);
    response.assertJSONSubset({
      name: 'user',
      ref: '111',
      profile: {
        role: 'admin',
      },
      createdBy: '222',
    });
    const createdAt = new Date(response.body.createdAt);
    assert.equalDate(dateJustBeforeCreatingUser, createdAt);
    assert.isOk(response.body._id);
  });
  
  test('it should get a user', async ({ client }) => {
    // Given
    const user = {
      name: 'user',
      ref: '111',
      profile: {
        role: 'admin',
      },
    };
  
    await createUser(client, user);
  
    // When
    const response = await getUser(client, user.ref);
  
    // Then
    response.assertStatus(200);
    response.assertJSONSubset({
      name: 'user',
      ref: '111',
      profile: {
        role: 'admin',
      },
      createdBy: '222',
    });
  });
  
  test('it should delete a user', async ({ client }) => {
    // Given
    const user = {
      name: 'Youssef',
      ref: '111',
      profile: {
        role: 'admin',
      },
    };
  
    await createUser(client, user);
  
    // When
    const response = await deleteUser(client, user.ref);
  
    // Then
    response.assertStatus(204);
  });
  
  test('it should get users', async ({ client }) => {
    // Given
    const user1 = {
      name: 'zineb',
      ref: '111',
      profile: {
        role: 'admin',
      },
    };
  
    const user2 = {
      name: 'zaynab',
      ref: '333',
      profile: {
        role: 'admin',
      },
    };
  
    await createUser(client, user1);
    await createUser(client, user2);
  
  
    // When
    const response = await getUsers(client);
  
  
    // Then
    response.assertStatus(200);
    response.assertJSONSubset([
      {
        name: 'zineb',
        ref: '111',
        profile: {
          role: 'admin',
        },
        createdBy: '222',
      },
      {
        name: 'zaynab',
        ref: '333',
        profile: {
          role: 'admin',
        },
        createdBy: '222',
      }]);
  });
  
  test('it should get users with defined pagination', async ({ client }) => {
    // Given
    const user1 = {
      name: 'zineb',
      ref: '111',
      profile: {
        role: 'admin',
      },
    };
  
    const user2 = {
      name: 'zaynab',
      ref: '333',
      profile: {
        role: 'admin',
      },
    };
  
    await createUser(client, user1);
    await createUser(client, user2);
    const firstPage = {
      page: 2,
      per_page: 1,
    };
  
    const secondPage = {
      page: 3,
      per_page: 1,
    };
  
    // When
    const firstResponse = await getUsers(client, firstPage);
    const secondResponse = await getUsers(client, secondPage);
  
  
    // Then
    firstResponse.assertStatus(200);
    firstResponse.assertJSONSubset([{
      name: 'zineb',
      ref: '111',
      profile: {
        role: 'admin',
      },
      createdBy: '222',
    }]);
  
    secondResponse.assertStatus(200);
    secondResponse.assertJSONSubset([{
      name: 'zaynab',
      ref: '333',
      profile: {
        role: 'admin',
      },
      createdBy: '222',
    }]);
  });
  
  test('it should not create a user when an attribute is missing', async ({ assert, client }) => {
    // Given
    const user = {
      ref: '111',
      profile: {
        role: 'admin',
      },
    };
  
    // When
    const response = await createUser(client, user);
    // Then
   response.assertStatus(400);
   assert.include(response.error.text, '"\\"name\\" is required');
  });
  
  test('it should not create a user when role is wrong', async ({ assert, client }) => {
    // Given
    const user = {
      name: 'zineb',
      ref: '111',
      profile: {
        role: 'WRONG_ROLE',
      },
    };
    // When
    const response = await createUser(client, user);
  
  
    // Then
    response.assertStatus(400);
    assert.equal(response.body.code, 'error.invalid.model');
    // eslint-disable-next-line no-useless-escape
    assert.include(response.error.text, '"message":\"\\\"profile.role\\\" must be one of [admin, user_1, user_2]');
  });
  
  test('it should not create duplicate of a user', async ({ assert, client }) => {
    // Given
    const user = {
      name: 'zineb',
      ref: '111',
      profile: {
        role: 'admin',
      },
    };
  
    const responseFirstUserCreated = await createUser(client, user);
  
    // When
    const responseDuplicateUser = await createUser(client, user);
  
    // Then
    responseFirstUserCreated.assertStatus(201);
    responseDuplicateUser.assertStatus(409);
    assert.equal(responseDuplicateUser.error.text, 'Duplicated');
  });
  