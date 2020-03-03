const ForbiddenException = use('App/Exceptions/ForbiddenException');
const NotFoundException = use('App/Exceptions/NotFoundException');

const grant = (user, requiredRoles) => user
  && user.profile
  && user.profile.role
  && requiredRoles.includes(user.profile.role);

class GrantService {
  constructor(UserModel) {
    this.UserModel = UserModel;
  }

  async grantOrFail(ref, requiredRoles) {
    const user = await this.UserModel.findOne({ ref });
    if(!user) {
      throw new NotFoundException();
    }
    if (!grant(user, requiredRoles)) {
     throw new ForbiddenException();
    }
  }
}
module.exports = GrantService;
