'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../../lib/ogws');
const gateways = require('./gateways-local').credentials;
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

describe('#getMobileIds()', function () {
  /*
  const apiKeys = ['ErrorID', 'Mobiles'];
  const mobileKeys = ['ID', 'Description', 'LastRegistrationUTC', 'LastRegionName', 'LastSatelliteNetwork', 'LastOperationMode'];
  */
  const apiKeys = ['errorId', 'mobiles'];
  const mobileKeys = ['mobileId', 'description', 'lastRegistrationTimeUtc', 'satelliteRegion', 'lastSatelliteNetwork', 'lastOperationMode'];
  const description = 'should return a list of Mobile information including' +
                      `${mobileKeys}`;
  it(description, async function () {
    const filter = {};
    try {
      const result = await idpApi.getMobileIds(auth, filter);
      expect(result)
          .to.be.an('Object')
          .that.includes.any.keys(apiKeys);
      expect(result.errorId).to.equal(0);
      if (result.mobiles !== null) {
        for (let i = 0; i < result.mobiles.length; i++) {
          expect(result.mobiles[i])
              .to.be.an('Object')
              .that.includes.all.keys(mobileKeys);
        }
      }
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  })
});
