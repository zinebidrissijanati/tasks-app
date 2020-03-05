/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const OAuth2Service = require('../Services/OAuth2Service');

class VerifyToken {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    const token = request.header('Authorization');
    let ref;
    let tokenInfo;
    if (process.env.NODE_ENV === 'development' && token && token.includes('FakeHeaderAllowGoThrough=')) {
      // eslint-disable-next-line prefer-destructuring
      ref = token.split('=')[1];
    } else if (token) {
      tokenInfo = await OAuth2Service.introspect(token);
      ref = tokenInfo.active ? tokenInfo.uid : undefined;
    }

    if (ref) {
      request.metadata = { ref };
      return next();
    }

    // call next to advance the request
    return response.unauthorized();
  }
}

module.exports = VerifyToken
