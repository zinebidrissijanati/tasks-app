const { test } = use('Test/Suite')('TaskAggregate');
const sinon = require('sinon');


const TaskAggregate = use('App/Core/TaskAggregate');
const ValidationException = use('App/Exceptions/ValidationException');
const NotFoundException = use('App/Exceptions/NotFoundException');
const requiredUserCrudRoles = [
    'admin'
  ];
  test('it should get a task by id', async ({ assert }) => {
    // Given
    const task = { _id: 'taskId', title: 'First Task' };
    const TaskModel = {
      findOne: sinon
        .stub()
        .resolves(task),
    };
  
    const performedBy = { ref: '111' };
    const GrantService = {
      grantOrFail: sinon.stub(),
    };
    const taskAggregate = new TaskAggregate(TaskModel, GrantService);
  
    // When
    const foundTask = await taskAggregate.getOne('taskId', performedBy);
  
    // Then
    sinon.assert.calledWith(GrantService.grantOrFail, '111', requiredUserCrudRoles);
    sinon.assert.calledWith(TaskModel.findOne, { _id: 'taskId' });
  
    assert.deepEqual(foundTask, task);
  });
  test('it shoud get tasks paginated', async ({assert}) => {
    //given
    const tasks=[{_id: 'taskId', title:'task title'}];
    const limit = sinon.stub().resolves(tasks);
    const skip = sinon.stub().returns({limit})
    const taskModel= {
        find: sinon.stub().returns({skip})
    }
    const GrantService= {
        grantOrFail: sinon.stub()
    }
    const taskAggregate = new TaskAggregate(taskModel,GrantService);
    const pagination= {
        page: 2,
        perPage: 15
    };
    const performedBy= {
        ref: '111'
    };
    //when
    const tasksResult= await taskAggregate.getTasks(pagination, performedBy);
    //then 
    sinon.assert.calledWith(GrantService.grantOrFail,'111', requiredUserCrudRoles);
    sinon.assert.calledWith(limit, 15);
    sinon.assert.calledWith(skip, 15);
    assert.deepEqual(tasks,tasksResult);
  });
  test('it should delete a task by _id', async ({assert})=> {
      //given
      const TaskModel = {
        deleteOne: sinon.stub().resolves(),
      };
      const GrantService = {
          grantOrFail: sinon.stub(),
      };
      const performedBy = {
          ref: '111'
      };
      const taskAggregate = new TaskAggregate(TaskModel, GrantService);
      //when
      await taskAggregate.deleteOne('Task Id', performedBy);
      //Then
      sinon.assert.calledWith(TaskModel.deleteOne, {_id: 'Task Id'});
      sinon.assert.calledWith(GrantService.grantOrFail,'111', requiredUserCrudRoles);
  });
  test('it should create a task', async ({assert}) => {
    //given
    const TaskModel = {
        create: sinon.stub().callsFake((c) => c)
    };
    const GrantService = {
        grantOrFail: sinon.stub()
    };
    const performedBy = {
        ref: '111'
    }
    const task = {
        title: 'task title example',
        date: new Date(),
        sequenceNumber: 1
    };
    const now = new Date();
    const taskAggregate = new TaskAggregate(TaskModel, GrantService);
    //when 
    const createdTask = await taskAggregate.create(task, performedBy);
    //Then 
    sinon.assert.calledWith(GrantService.grantOrFail, '111', requiredUserCrudRoles);
    sinon.assert.called(TaskModel.create);
    assert.equal(createdTask.title, task.title);
    assert.equalDate(createdTask.createdAt, now);
    assert.equal(createdTask.createdBy, performedBy.ref)
  });
  test('it should throw any error when create fails', async ({ assert }) => {
    // Given
    const TaskModel = {
      create: sinon
        .stub()
        .throws('SomeError'),
    };
    const performedBy = { ref: '111' };
    const GrantService = {
      grantOrFail: sinon.stub(),
    };
    const taskAggregate = new TaskAggregate(TaskModel, GrantService);
    const payload = {
      title: 'first task example',
      date : new Date(),
      sequenceNumber: 1
    };
  
    // When
    const taskCreationPromise = taskAggregate.create(payload, performedBy);
  
    // Then
    sinon.assert.calledWith(GrantService.grantOrFail, '111', requiredUserCrudRoles);
    await assert.isRejected(taskCreationPromise, Error);
    sinon.assert.called(TaskModel.create);
  });
  
  test('it should throw bad request when task attributes are not ok', async ({ assert }) => {
    // Given
    const TaskModel = {};
    const performedBy = { ref: '111' };
    const GrantService = {
      grantOrFail: sinon.stub(),
    };
    const taskAggregate = new TaskAggregate(TaskModel, GrantService);
    const payload = {
      title: 'task',
    };
  
    // When
    const taskCreationPromise = taskAggregate.create(payload, performedBy);
  
    // Then
    sinon.assert.calledWith(GrantService.grantOrFail, '111', requiredUserCrudRoles);
    return assert.isRejected(taskCreationPromise, ValidationException);
  });
  
  