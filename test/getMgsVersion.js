'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../lib/api-v1');

describe('#getMgsVersion()', function () {
  it('should return a version string from default host', async function () {
    try {
      const result = await idpApi.getMgsVersion();
      console.log('Returned:', JSON.stringify(result));
      expect(result).to.be.a('string');
      let parts = result.split('.');
      expect(parts).to.have.length(4);
      //TODO: additional criteria on format Major.minor.patch.build
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  });
  it('should return a version string from alternate host', async function () {
    try {
      const alt = 'https://isatdatapro.skywave.com/GLGW/GWServices_v1/RestMessages.svc/';
      const result = await idpApi.getMgsVersion(alt);
      console.log('Returned:', JSON.stringify(result));
      expect(result).to.be.a('string');
      let parts = result.split('.');
      expect(parts).to.have.length(4);
      //TODO: additional criteria on format Major.minor.patch.build
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  });
});
