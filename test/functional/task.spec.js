/* eslint-disable no-underscore-dangle */
const {
    test, trait, beforeEach,
  } = use('Test/Suite')('Task');
  
  
  const {
    clearUsers, injectAdmin,
  } = require('./user-fixtures');
  
  const {
    clearTasks, createTask, getTask, getTasks, deleteTask,
  } = require('./task-fixtures');
  
  trait('Test/ApiClient');
  
  beforeEach(async () => {
    await clearUsers();
    await clearTasks();
    await injectAdmin('222');
  });
  
  test('it should create a task with only required fields', async ({ assert, client }) => {
    // Given
    const task = {
      title: 'title example',
      date: new Date(),
      sequenceNumber: 1,
    };
  
    const dateJustBeforeCreatingTask = new Date();
  
  
    // When
    const response = await createTask(client, task);
  
    // Then
    response.assertStatus(201);
    response.assertJSONSubset({
    title: 'title example',
    sequenceNumber: 1,
    createdBy: '222',
    });
    const createdAt = new Date(response.body.createdAt);
    const date = new Date(response.body.date);
    assert.equalDate(dateJustBeforeCreatingTask, createdAt);
    assert.equalDate(dateJustBeforeCreatingTask, date);
    assert.isOk(response.body._id);
  });
 
  test('it should fail to create a task without required fields', async ({ assert, client }) => {
    // Given
    const task = {
        date: new Date(),
        sequenceNumber: 1,
    };
  
  
    // When
    const response = await createTask(client, task);
  
    // Then
    response.assertStatus(400);
    assert.include(response.error.text, '"\\"title\\" is required');
  });
  
  test('it should show a task', async ({ client }) => {
    // Given
    const task = {
        title: 'title example',
        date: new Date(),
        sequenceNumber: 1,
    };
    const created = await createTask(client, task);
  
    // When
    const response = await getTask(client, created.body._id);
  
  
    // Then
    response.assertStatus(200);
    response.assertJSONSubset({
        title: 'title example',
        sequenceNumber: 1,
      createdBy: '222',
    });
  });
  
  test('it should show tasks default pagination', async ({ client }) => {
    // Given
    const task1 = {
        title: 'title example 1',
        date: new Date(),
        sequenceNumber: 1,
    };
  
    const task2 = {
        title: 'title example 2',
        date: new Date(),
        sequenceNumber: 2,
    };
  
    await createTask(client, task1);
    await createTask(client, task2);
  
  
    // When
    const response = await getTasks(client);
  
  
    // Then
    response.assertStatus(200);
    response.assertJSONSubset([
      {
        title: 'title example 1',
        sequenceNumber: 1,
      },
      {
        title: 'title example 2',
        sequenceNumber: 2,
      }]);
  });
  
  test('it should show tasks with pagination', async ({ client }) => {
    // Given
    const task1 = {
        title: 'title example 1',
        date: new Date(),
        sequenceNumber: 1,
    };
  
    const task2 = {
        title: 'title example 2',
        date: new Date(),
        sequenceNumber: 2,
    };
    await createTask(client, task1);
    await createTask(client, task2);
    const firstPage = {
      page: 1,
      per_page: 1,
    };
  
    const secondPage = {
      page: 2,
      per_page: 1,
    };
  
    // When
    const firstResponse = await getTasks(client, firstPage);
    const secondResponse = await getTasks(client, secondPage);
  
  
    // Then
    firstResponse.assertStatus(200);
    firstResponse.assertJSONSubset([
      {
        title: 'title example 1',
        sequenceNumber: 1,
      },
    ]);
  
    secondResponse.assertStatus(200);
    secondResponse.assertJSONSubset([
      { title: 'title example 2',
      sequenceNumber: 2,
      }]);
  });
  
  test('it should delete a task', async ({ client }) => {
    // Given
    const task = {
        title: 'title example 1',
        date: new Date(),
        sequenceNumber: 1,
    };
    const created = await createTask(client, task);
  
    // When
    const response = await deleteTask(client, created.body._id);
  
  
    // Then
    response.assertStatus(204);
  });
  