'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../../lib/ogws');
const accounts = require('./accounts-local').credentials;
let auth = new idpApi.ApiV1Auth(accounts[0].accessId, accounts[0].password);

const mobiles = require('./accounts-local').mobiles;
const testMobileId = mobiles[0].mobileId;

const RETRIEVAL_OFFSET = 24;   //: for Forward statuses

describe('#ForwardMessage test suite', function() {
  let idList = [];
  
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

  describe('#submitForwardMessages()', function () {
    let userMessageId = 0;
    beforeEach(function() {
      userMessageId += 1;
    });
    const apiKeys = ['errorId', 'submissions'];
    const submissionKeys = ['errorId', 'messageId', 'userMessageId', 
      'mobileId', 'stateTimeUtc','size'
    ];
    const description = `should return an array of Submissions ` +
        `with keys: ${submissionKeys}`;
    it(description, async function () {
      let message = [16, 1]; // getTerminalInfo
      const uint8Array = new Uint8Array(message);
      const base64String = Buffer.from(uint8Array).toString('base64');
      
      const testMessage = {
        mobileId: testMobileId,
        userMessageId: userMessageId,
        payloadRaw: base64String,
      };
      console.log(`Submitting message to ${testMobileId}`);
      const messages = [testMessage];
      try {
        const result = await idpApi.submitForwardMessages(auth, messages);
        expect(result).to.be.an('Object').that.includes.all.keys(apiKeys);
        expect(result.errorId).to.equal(0);
        expect(result.submissions).to.be.an('Array').that.has.lengthOf(1);
        let submission = result.submissions[0];
        expect(submission).to.be.an('Object')
          .that.includes.any.keys(submissionKeys);
        idList.push(submission.messageId);
        console.log(`Added ${submission.messageId} to idList ${JSON.stringify(idList)}`);
        expect(submission.userMessageId).to.equal(userMessageId);
        expect(submission.mobileId).to.equal(testMobileId);
        if (submission.modemWakeupPeriod) {
          expect(submission).has.property('scheduledSendTimeUtc');
        }
      } catch (err) {
        console.error(err.message);
        throw err;
      }
    })
  });
  
  describe('#getForwardStatuses()', function () {
    //Get the status of the submitted message
    const apiKeys = ['errorId', 'statuses', 'more', 'nextStartTimeUtc'];
    const statusKeys = ['errorId', 'messageId', 'state', 'statusUtc', 'isClosed'];
    const description = `should return an array of Statuses with ${statusKeys}`;
    it(description, async function () {
      console.log(`Checking locally stored statuses: ${idList}`);
      let filter = {};
      if (idList.length > 0) {
        filter.ids = idList;
      } else {
        const date = new Date();
        date.setUTCHours(date.getUTCHours() - RETRIEVAL_OFFSET);
        filter.fromUtc = date;
      }
      try {
        const result = await idpApi.getForwardStatuses(auth, filter);
        expect(result).to.be.an('Object').that.includes.any.keys(apiKeys);
        if (result.errorId !== 0) {
          idpApi.getErrorName(auth, result.errorId).then(errorName => {
            console.log('getForwardStatuses ERROR: ' + errorName);
          });
        }
        expect(result.errorId).to.equal(0);
        if (result.more) {
          expect(result.more).to.be.a('boolean');
          expect(result.nextStartTimeUtc).to.be.a('string');
        }
        expect(result.statuses).to.be.an('Array');
        for (let i = 0; i < result.statuses.length; i++) {
          let status = result.statuses[i];
          expect(status)
              .to.be.an('Object')
              .that.includes.any.keys(statusKeys);
          if(status.errorId){
            expect(status.errorId).to.be.a('number');
          }
          expect(status.state).to.be.a('number');
          expect(status.statusUtc).to.be.a('string');
        }
      } catch (err) {
        console.error(err.message);
        throw err;
      }
    });
  });
  
  describe('#getForwardMessages()', function() {
    const apiKeys = ['errorId', 'messages'];
    const messageKeys = ['messageId', 'mobileId', 'mailboxTimeUtc', 'errorId',
      'isClosed', 'state', 'stateTimeUtc', 'referenceNumber', 'payloadJson', 'payloadRaw'
    ];
    it(`should return array of message(s) each with ${messageKeys}`, async function () {
      if (idList.length > 0) {
        try {
          const result = await idpApi.getForwardMessages(auth, idList);
          console.log('getForwardMessages RESULT: ' + JSON.stringify(result));
          expect(result).to.be.an('Object').that.includes.all.keys(apiKeys);
          expect(result.errorId).to.equal(0);
          expect(result.messages).to.be.an('Array')
            .that.has.lengthOf.greaterThan(0);
          for (let i = 0; i < result.messages.length; i++) {
            let message = result.messages[i];
            expect(message).to.be.an('Object')
              .that.includes.any.keys(messageKeys);
          }
        } catch (err) {
          console.error(err.message);
          throw err;
        }
      }
    });
    //Retrieve the message that was submitted
  });

  describe('#cancelForwardMessages()', function() {
    const apiKeys = ['errorId', 'cancellations'];
    const cancellationKeys = ['errorId', 'messageId', 'cancellationStatus', 'cancelRequestId'];
    const description = `should return a list of cancellations each with ${cancellationKeys}`;
    //Retrieve the message that was submitted
    it(description, async function () {
      if (idList.length > 0) {
        try {
          const result = await idpApi.cancelForwardMessages(auth, idList);
          //console.log('cancelForwardMessages RESULT: ' + JSON.stringify(result, null, 2));
          expect(result).to.be.an('Object').that.includes.all.keys(apiKeys);
          expect(result.errorId).to.equal(0);
          expect(result.cancellations).to.be.an('Array').that.has.lengthOf.greaterThan(0);
          for (let i = 0; i < result.cancellations.length; i++) {
            let cancellation = result.cancellations[i];
            expect(cancellation).to.be.an('Object')
              .that.includes.any.keys(cancellationKeys);
          }
        } catch (err) {
          console.error(err.message);
          throw err;
        }
      }
    });
  });
});
