'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../../lib/ogws');
const gateways = require('./gateways-local').credentials;
let auth = new idpApi.ApiV1Auth(gateways[0].accessId, gateways[0].password);
const badAuth = new idpApi.ApiV1Auth('bad', 'bad');

const RETRIEVAL_OFFSET = 72;

describe('#getReturnMessages()', function () {
  /* Native API responses
  const apiKeys = ['ErrorID', 'Messages', 'More', 'NextStartUTC', 'NextStartID'];
  const messageKeys = ['ID', 'MobileID', 'ReceiveUTC', 'MessageUTC', 'RegionName', 'SIN'];
  const payloadKeys = ['SIN', 'MIN', 'Name', 'Fields'];
  */
  const apiKeys = ['errorId', 'messages', 'more', 'nextFromUtc', 'nextStartId'];
  const messageKeys = ['messageId', 'mobileId', 'receiveTimeUtc', 'mailboxTimeUtc', 'satelliteRegion', 'codecServiceId', 'size'];
  const payloadKeys = ['codecServiceId', 'codecMessageId', 'name', 'fields'];
  const fieldKeys = ['name', 'dataType', 'stringValue'];
  const arrayFieldKeys = ['name', 'dataType', 'arrayElements'];
  const arrayKeys = ['index', 'fields'];
  //: Set high water mark reference N hours ago
  const date = new Date();
  date.setUTCHours(date.getUTCHours() - RETRIEVAL_OFFSET);
  const filter = {
    startTimeUtc: date,
  };

  let description = `should include properties ${apiKeys}`;
  
  describe('with invalid authentication', function() {
    const authErrCode = 21785;
    it(`should return a 401 Unauthorized from default host`, async function() {
      try {
        const result = await idpApi.getReturnMessages(badAuth, filter);
      } catch (err) {
        expect(err);
      }
    });
  });

  describe('get token from authentication', function () {
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

  describe('with valid authentication', async function() {
    description = description +
        `\n\t where messages include properties ${messageKeys}` +
        `\n\t and if a message includes payloadJson it has keys ${payloadKeys}` +
        '\n\t and if a message includes payloadRaw it is a raw binary payload';
    it(description, async function () {
      try {
        const result = await idpApi.getReturnMessages(auth, filter);
        expect(result).to.be.an('Object').that.has.any.keys(apiKeys);
        expect(result.errorId).to.equal(0);
        if (result.messages !== null) {
          console.log(`Retreived ${result.messages.length} messages like: ` +
              `${JSON.stringify(result.messages[0])}`);
          result.messages.forEach(message => {
            expect(message).to.be.an('Object').that.includes.all.keys(messageKeys);
            if (message.payloadRaw) {
              expect(message.payloadRaw).to.be.an('string');
            }
            if (message.payloadJson) {
              expect(message.payloadJson).to.have.all.keys(payloadKeys);
              message.payloadJson.fields.forEach(field => {
                if (field.dataType !== 'array' && field.dataType !== 'message') {
                  expect(field).to.have.all.keys(fieldKeys);
                } else {
                  // TODO: support message dataType?
                  expect(field).to.have.all.keys(arrayFieldKeys);
                  field.arrayElements.forEach(element => {
                    expect(element).to.have.all.keys(arrayKeys);
                    element.fields.forEach(field => {
                      expect(field).to.have.all.keys(fieldKeys);
                    });
                  });
                }
              });
            }
          });
          expect(result.nextFromUtc).to.be.a('string').not.equal('');
          if(result.more) {
            expect(result.nextStartId).to.be.a('number').above(-1);
          }
        } else {
          console.log(`No retrieved messages: ${JSON.stringify(result)}`);
          expect(result.nextStartId).to.equal(-1);
        }
      } catch (err) {
        console.error(err.message);
        throw err;
      }
    })
  });
});
