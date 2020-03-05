const TaskModel = use('App/Models/Task');

/**
 * Create a task --- POST /tasks
 * @param {object} client http client
 * @param {object} task
 * @returns {object} response
 */
const createTask = (client, task, performedByRef = '222') => client
  .post('/api/v1/tasks')
  .header('Authorization', `FakeHeaderAllowGoThrough=${performedByRef}`)
  .send(task)
  .end();

/**
 * Show a task --- GET /tasks/:id
 * @param {object} client http client
 * @param {object} ldap
 * @returns {object} response
 */
const getTask = (client, ref, performedByRef = '222') => client
  .get(`/api/v1/tasks/${ref}`)
  .header('Authorization', `FakeHeaderAllowGoThrough=${performedByRef}`)
  .send()
  .end();

/**
 * Show  tasks --- GET /tasks
 * @param {object} client
 * @param {object} pagination
 * @returns {object} response
 */
const getTasks = (client, pagination, performedByRef = '222') => {
  const query = pagination ? `?page=${pagination.page}&per_page=${pagination.per_page}` : '';
  return client.get(`/api/v1/tasks${query}`)
    .header('Authorization', `FakeHeaderAllowGoThrough=${performedByRef}`)
    .send()
    .end();
};

/**
 * delete a task --- DELETE /tasks/:id
 * @param {object} client http client
 * @param {object} ref
 * @returns {object} response
 */
const deleteTask = (client, ref, performedByRef = '222') => client
  .delete(`/api/v1/tasks/${ref}`)
  .header('Authorization', `FakeHeaderAllowGoThrough=${performedByRef}`)
  .send()
  .end();

const clearTasks = () => TaskModel.deleteMany({});


module.exports = {
  createTask,
  getTask,
  getTasks,
  deleteTask,
  clearTasks,
};
