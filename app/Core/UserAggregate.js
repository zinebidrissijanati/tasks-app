const UserValidator = require('./Validators/UserValidator.js');

const DuplicatedException = use('App/Exceptions/DuplicatedException');
const NotFoundException = use('App/Exceptions/NotFoundException');

const isUserAccessingOwnData = (ref, perfomedByRef) => ref === perfomedByRef;

class UserAggregate {
  constructor(UserModel, GrantService) {
    this.userModel = UserModel;
    this.grantService = GrantService;
    this.requiredRoles = [
      'admin',
      'user_1',
    ];
  }

  async findOrFail(ldap) {
    const user = await this.userModel.findOne({ ldap });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getOneByLdap(ref, perfomedBy) {
    if (!isUserAccessingOwnData(ref, perfomedBy.ref)) {
      await this.grantService.grantOrFail(perfomedBy.ref, this.requiredRoles);
    }

    return this.findOrFail(ref);
  }

  async getUsers(pagination, perfomedBy) {
    await this.grantService.grantOrFail(perfomedBy.ref, this.requiredRoles);


    const skips = pagination.perPage * (pagination.page - 1);
    return this.userModel.find().skip(skips).limit(pagination.perPage);
  }

  async deleteOneByLdap(ref, perfomedBy) {
    await this.grantService.grantOrFail(perfomedBy.ref, this.requiredRoles);

    return this.userModel.deleteOne({ ref });
  }

  async create(user, perfomedBy) {
    await this.grantService.grantOrFail(perfomedBy.ref, this.requiredRoles);


    const copy = { ...user };
    copy.createdBy = perfomedBy.ref;
    copy.createdAt = new Date();

    UserValidator.validateOrThrow(copy);

    let userCreated;
    try {
      userCreated = await this.userModel.create(copy);
    } catch (error) {
      if (error.message.includes('duplicate')) {
        throw new DuplicatedException(error);
      }
      throw error;
    }
    return userCreated;
  }

  async update(update, perfomedBy) {
    await this.grantService.grantOrFail(perfomedBy.ref, this.requiredRoles);


    const user = await this.findOrFail(update.ref);
    delete update.createdAt;
    delete update.createdBy;
    Object.assign(user, update);
     //?
    UserValidator.validateOrThrow(user._doc);

    await user.save();

    return user;
  }
}

module.exports = UserAggregate;
