const axios = require('axios');
const qs = require('qs');
const https = require('https');

const Config = use('Config');
const uri = Config.get('auth.oauth.url');
const secret = Config.get('auth.oauth.key');

const getToken = async (authorizationCode, redirectUri) => {
  const url = `${uri}/as/token.oauth2?grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${redirectUri}`;
  const option = {
    headers: {
      Authorization: `Basic ${secret}`,
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  };
  const response = await axios.post(url, {}, option);
  return response.data;
};

async function introspect(token) {
  const url = `${uri}/as/introspect.oauth2`;
  const options = {
    headers: {
      Authorization: `Basic ${secret}`,
      Accept: 'application/json',
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  };
  const response = await axios.post(url, qs.stringify({ token }), options);
  return response.data;
}


module.exports = {
  introspect,
  getToken,
};
