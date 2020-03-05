const UserAggregate = use('App/Core/UserAggregate');
const GrantService = use('App/Core/GrantService');
const UserModel = require('../../Models/User');

class UserController {
    constructor() {
        const grantService = new GrantService(UserModel);
        this.userAggregate = new UserAggregate(UserModel, grantService);
      }
    
      async index({ request, response }) {
        const pagination = {};
    
        pagination.page = +request.input('page', 1);
        pagination.perPage = +request.input('per_page', 20);
    
        const user = await this.userAggregate.getUsers(pagination, request.metadata);
        response.ok(user);
      }
    
      async show({ request, response }) {
        const ref = request.params.id;
    
        const user = await this.userAggregate.getOneByRef(ref, request.metadata);
        response.ok(user);
      }
    
      async store({ request, response }) {
        const user = await this.userAggregate.create(request.body, request.metadata);
    
        return response.created(user);
      }
    
      async destroy({ request, response }) {
        const ref = request.params.id;
    
        await this.userAggregate.deleteOneByRef(ref, request.metadata);
        response.noContent();
      }
}

module.exports = UserController
