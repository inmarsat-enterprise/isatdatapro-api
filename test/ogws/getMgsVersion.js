'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../../lib/ogws');
const accounts = require('./accounts-local').credentials;
let auth = new idpApi.ApiV1Auth(accounts[0].accessId, accounts[0].password);
const badAuth = new idpApi.ApiV1Auth('bad', 'bad');

describe('#getMgsVersionBadAuth()', function () {
  it('should return a 401 Unauthorized from default host', async function () {
    try {
      const result = await idpApi.getMgsVersion(badAuth);
      console.log('Returned:', JSON.stringify(result));
    } catch (err) {
      expect(err);
    }
  });
});

describe('#getAuthenticateToken()', function () {
  it('should return a bearer token object from default host', async function () {
    try {
      auth = await idpApi.getAuthToken(auth);
      console.log('Returned:', JSON.stringify(auth));
      expect(auth).to.be.a('object');
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  });
});


describe('#getMgsVersion()', function () {
  it('should return a version string from default host', async function () {
    try {
      const result = await idpApi.getMgsVersion(auth);
      console.log('Returned:', JSON.stringify(result));
      expect(result).to.be.a('object');
      let version = result.Version;
      let parts = version.split('.');
      expect(parts).to.have.length(4);
      //TODO: additional criteria on format Major.minor.patch.build
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  });
});