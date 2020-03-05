/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.resource('users', 'UserController')
  .apiOnly()
  .middleware(['auth']);

Route.resource('tasks', 'TaskController')
  .apiOnly()
  .middleware(['auth']);
Route.post('oauth/token', 'OAuthController.getToken');

