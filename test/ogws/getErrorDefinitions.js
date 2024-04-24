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
      console.log('Returned:', JSON.stringify(result));
      expect(result).to.be.a('object');
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  });
});

describe('#getErrorDefinitions()', function () {
  const keys = ['errorId', 'name', 'description'];
  const testDesc = 'should return a non-empty Array of error code objects'
                    + ` with properties ${keys}`;
  it(testDesc, async function () {
    try {
      const result = await idpApi.getErrorDefinitions(auth);
      expect(result)
        .to.be.an('Array')
        .that.has.lengthOf.above(1);
      console.log(`Returned ${result.length} definitions`);
      //console.log('First entry:', JSON.stringify(result[0], null, 2));
      for (let i = 0; i < result.length; i++) {
        expect(result[i]).to.have.all.keys(keys);
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
      throw err;
    }
  })
});
