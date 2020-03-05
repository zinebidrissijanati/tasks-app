const OAuth2Service = require('../../Services/OAuth2Service');

const getToken = async ({ request, response }) => {
  const res = await OAuth2Service.getToken(request.body.code, request.body.redirectUri);
  response.ok(res);
};

module.exports = {
  getToken,
};
