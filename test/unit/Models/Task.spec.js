const { test } = use('Test/Suite')('Models/Task');
const Task = use('App/Models/Task');

test('Task should be instanciate when schema is valid', async ({ assert }) => {
    const task = new Task();
    task.title = 'title';
    task.date = Date.now();
    task.description = 'some description';
    task.sequenceNumber = 1;
    task.createdAt = Date.now();
    task.createdBy = '111'
    const error = await task.validateSync();
    assert.isUndefined(error);
  });

  test('Task should not be instanciate when schema is failing', async ({ assert }) => {
    const task = new Task();
    task.description = 'some description here';
    const error = await task.validateSync();
    assert.isOk(error.errors.title);
    assert.isOk(error.errors.createdAt);
    assert.isOk(error.errors.createdBy);
    assert.isOk(error.errors.date);
    assert.isOk(error.errors.sequenceNumber);
});