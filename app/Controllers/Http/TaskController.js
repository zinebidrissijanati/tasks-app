const TaskAggregate = use('App/Core/TaskAggregate');
const GrantService = use('App/Core/GrantService');
const TaskModel = require('../../Models/Task');
const UserModel = require('../../Models/User');

class TaskController {
    constructor() {
        const grantService = new GrantService(UserModel);
        this.taskAggregate = new TaskAggregate(TaskModel, grantService);
      }
    
      async index({ request, response }) {
        const pagination = {};
    
        pagination.page = +request.input('page', 1);
        pagination.perPage = +request.input('per_page', 20);
    
        const task = await this.taskAggregate.getTasks(pagination, request.metadata);
        response.ok(task);
      }
    
      async show({ request, response }) {
        const { id } = request.params;
    
        const task = await this.taskAggregate.getOne(id, request.metadata);
        response.ok(task);
      }
    
      async store({ request, response }) {
        const task = await this.taskAggregate.create(request.body, request.metadata);
    
        return response.created(task);
      }
    
      async destroy({ request, response }) {
        const { id } = request.params;
    
        await this.taskAggregate.deleteOne(id, request.metadata);
        response.noContent();
      }
}

module.exports = TaskController
