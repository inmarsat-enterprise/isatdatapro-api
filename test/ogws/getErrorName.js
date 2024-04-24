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

describe('#getErrorName()', function () {
  const testCases = {
    0: 'NO_ERRORS',
    1000: 'UNDEFINED',
    23: 'ERR_INVALID_INPUT_DATA',
  };
  context('with number', function () {
    for (let key in testCases) {
      if (!testCases.hasOwnProperty(key)) continue;
      it(key + ' should return ' + testCases[key], async function () {
        try {
          const result = await idpApi.getErrorName(auth, key);
          console.log(`Error ID ${key} = ${result}`);
          expect(result).to.equal(testCases[key]);
        } catch (err) {
          console.error(err.message);
          throw err;
        }
      })
    }
  })
});
