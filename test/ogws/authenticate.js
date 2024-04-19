'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../../lib/ogws');
const gateways = require('./gateways-local').credentials;
// const OGWS = require('../../lib/ogws');
// const config = {auth:{
//   accessId: gateways[0].accessId,
//   password: gateways[0].password,
// }}
// const ogx = new OGWS.Service(config);
let auth = new idpApi.ApiV1Auth(gateways[0].accessId, gateways[0].password);

describe('#getAuthenticateToken()', function () {
  it('should return a bearer token object from default host', async function () {
    try {
      const result = await idpApi.getAuthToken(auth);
      console.log('Returned:', JSON.stringify(result));
      expect(result).to.be.a('object');
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  });
});
