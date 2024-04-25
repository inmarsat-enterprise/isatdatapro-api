'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../../lib/ogws');
const accounts = require('./accounts-local').credentials;
let auth = new idpApi.ApiV1Auth(accounts[0].accessId, accounts[0].password);

describe('#getAuthenticateToken()', function () {
  it('should return a bearer token object from default host', async function () {
    try {
      const result = await idpApi.getAuthToken(auth);
      console.log('Response:', JSON.stringify(result));
      expect(result).to.be.a('object');
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  });
});
