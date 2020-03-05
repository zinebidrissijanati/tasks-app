const UserModel = use('App/Models/User');

/**
 * Create a user --- POST /users
 * @param {object} client http client
 * @param {object} user
 * @returns {object} response
 */
const createUser = (client, user, performedByRef = '222') => client
  .post('/api/v1/users')
  .header('Authorization', `FakeHeaderAllowGoThrough=${performedByRef}`)
  .send(user)
  .end();

/**
 * @param {object} client
 * @returns {object} response
 */
const getUser = (client, id) => client
  .get(`/api/v1/users/${id}`)
  .header('Authorization', 'FakeHeaderAllowGoThrough=222')
  .send()
  .end();

/**
 * @param {object} client
 * @param {object} pagination
 * @returns {object} response
 */
const getUsers = (client, pagination) => {
  const query = pagination ? `?page=${pagination.page}&per_page=${pagination.per_page}` : '';
  return client.get(`/api/v1/users${query}`)
    .header('Authorization', 'FakeHeaderAllowGoThrough=222')
    .send()
    .end();
};

/**
 * @param {object} client
 * @returns {object} response
 */
const deleteUser = (client, id) => client
  .delete(`/api/v1/users/${id}`)
  .header('Authorization', 'FakeHeaderAllowGoThrough=222')
  .send()
  .end();

/**
 * clear users collection db
 */
const clearUsers = () => UserModel.deleteMany({});

const injectAdmin = (ref) => UserModel.create(
  {
    ref,
    name: 'zineb',
    profile: {
      role: 'admin',
    },
    createdAt: new Date(),
    createdBy: 'me',
  },
);

const injectUser_1 = (ref) => UserModel.create(
  {
    ref,
    firstname: 'zaynab',
    profile: {
      role: 'user_1',
    },
    createdAt: new Date(),
    createdBy: 'me',
  },
);


module.exports = {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  clearUsers,
  injectAdmin,
  injectUser_1,
};
