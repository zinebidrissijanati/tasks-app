const nock = require('nock');

const {
  test, trait, timeout,
} = use('Test/Suite')('Oauth');

timeout(300000);

trait('Test/ApiClient');

const Config = use('Config');
const uri = Config.get('auth.oauth.url');
const secret = Config.get('auth.oauth.key');

/**
 * Mock Ping authorization
 */
function mockPingAuthorizationResponse(code, redirectUri) {
  nock(uri, {
    reqheaders: {
      Authorization: `Basic ${secret}`,
    },
  })
    .post('/as/token.oauth2')
    .query({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    })
    .reply(200, { access_token: 'token', expires_in: 500 });
}

test('it should return token when code is valid', async ({ assert, client }) => {
  // Given
  const code = 'VALIDCODE';
  const redirectUri = 'http://valid.redirect.uri';
  mockPingAuthorizationResponse(code, redirectUri);
  const payload = {
    grant_type: 'authorization_code',
    code,
    redirectUri,
  };


  // When
  const response = await client
    .post('api/v1/oauth/token')
    .send(payload)
    .end();
  // Then
  response.assertStatus(200);
  const token = response.body.access_token;
  assert.equal(token, 'token');
});
