'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../../lib/ogws');
const accounts = require('./accounts-local').credentials;
let auth = new idpApi.ApiV1Auth(accounts[0].accessId, accounts[0].password);

const mobiles = require('./accounts-local').mobiles;

const RETRIEVAL_OFFSET = 24;   //: for Forward statuses

describe('#ForwardMessageToMultiple test suite', function() {
  let idList = [];
  for (const mobile of mobiles) {
    idList.push(mobile.mobileId);
  }
  
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

  describe('#submitForwardMessageToMultiple()', function () {
    let userMessageId = 0;
    beforeEach(function() {
      userMessageId += 1;
    });
    const apiKeys = ['errorId', 'submissions'];
    const submissionKeys = ['errorId', 'messageId', 'mobileId', 'size'];
    const description = `should return an array of Submissions ` +
        `with keys: ${submissionKeys}`;
    it(description, async function () {
      let message = [16, 1]; // getTerminalInfo
      const uint8Array = new Uint8Array(message);
      const base64String = Buffer.from(uint8Array).toString('base64');
      
      const testMessage = {
        payloadRaw: base64String,
      };
      console.log(`Submitting message to ${idList}`);
      try {
        const result = await idpApi.submitForwardMessageToMultiple(auth, testMessage, idList);
        expect(result).to.be.an('Object').that.includes.all.keys(apiKeys);
        expect(result.errorId).to.equal(0);
        expect(result.submissions).to.be.an('Array').that.has.lengthOf(idList.length);
        let submission = result.submissions[0];
        expect(submission).to.be.an('Object')
          .that.includes.any.keys(submissionKeys);
        // idList.push(submission.messageId);
        // console.log(`Added ${submission.messageId} to idList ${JSON.stringify(idList)}`);
        // expect(submission.userMessageId).to.equal(userMessageId);
        // expect(submission.mobileId).to.equal(testMobileId);
      } catch (err) {
        console.error(err.message);
        throw err;
      }
    })
  });
  
});
