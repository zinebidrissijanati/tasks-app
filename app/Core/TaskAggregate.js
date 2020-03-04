const TaskValidator = require('./Validators/TaskValidator.js');

class TaskAggregate {
    constructor(TaskModel, GrantService) {
        this.taskModel=TaskModel;
        this.grantService=GrantService;
        this.requiredRoles = [
            'admin',
          ];
    }
    async getOne(id, perfomedBy) {
        await this.grantService.grantOrFail(perfomedBy.ref, this.requiredRoles);
        return this.taskModel.findOne({ _id: id });
    }
    async getTasks(pagination, perfomedBy) {
        await this.grantService.grantOrFail(perfomedBy.ref, this.requiredRoles);
    
        const skips = pagination.perPage * (pagination.page - 1);
        return this.taskModel.find().skip(skips).limit(pagination.perPage);
    }
    async deleteOne(id, perfomedBy) {
        await this.grantService.grantOrFail(perfomedBy.ref, this.requiredRoles);
    
        return this.taskModel.deleteOne({ _id: id });
      }
    async create(task, performedBy) {
        await this.grantService.grantOrFail(performedBy.ref, this.requiredRoles);
        const copy= {...task};
        copy.createdAt=new Date();
        copy.createdBy=performedBy.ref;
        TaskValidator.validateOrThrow(copy);
        const createdTask=await this.taskModel.create(copy);
        return createdTask;
    }
    
}
module.exports = TaskAggregate;