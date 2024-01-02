'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../lib/api-v1');

describe('#getErrorName()', function () {
  const testCases = {
    0: 'NO_ERRORS',
    1000: 'UNDEFINED',
  };
  context('with number', function () {
    for (let key in testCases) {
      if (!testCases.hasOwnProperty(key)) continue;
      it(key + ' should return ' + testCases[key], async function () {
        try {
          const result = await idpApi.getErrorName(key);
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
