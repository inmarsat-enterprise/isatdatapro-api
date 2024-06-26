'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../lib/igws');
const mailboxes = require('./mailboxes-local').credentials;

const mailboxIndex = mailboxes.length - 1;
const auth = mailboxes[mailboxIndex];

describe('#getMobileIds()', function () {
  /*
  const apiKeys = ['ErrorID', 'Mobiles'];
  const mobileKeys = ['ID', 'Description', 'LastRegistrationUTC', 'RegionName'];
  */
  const apiKeys = ['errorId', 'mobiles'];
  const mobileKeys = ['mobileId', 'description', 'lastRegistrationTimeUtc', 'satelliteRegion'];
  const description = 'should return a list of Mobile information including' +
                      `${mobileKeys}`;
  it(description, async function () {
    const filter = {};
    try {
      const result = await idpApi.getMobileIds(auth, filter);
      expect(result)
          .to.be.an('Object')
          .that.includes.all.keys(apiKeys);
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
  //TODO: exercise error cases bad auth, filter out of range, mobile filter
});
