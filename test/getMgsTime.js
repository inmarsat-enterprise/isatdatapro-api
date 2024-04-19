'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../lib/igws');

describe('#getMgsTime()', function () {
  it('should return UTC time as a JS Date', async function () {
    try {
      const result = await idpApi.getMgsTime();
      console.log('Returned:', JSON.stringify(result));
      expect(result).to.be.a('Date');
    } catch (err) {
      console.log(`Error: ${err.message}`);
      throw err;
    }
  });
});
