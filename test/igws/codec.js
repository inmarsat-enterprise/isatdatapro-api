const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;

const { decodeMessage } = require('../../lib/messageCodec');

describe('#decodeMessage()', function () {
  
  const idpmsgTest = './test/fieldedge-iotdemo.idpmsg';

  context('with idpmsg file', function() {
    it('should decode the test message', function() {
      const decoded = decodeMessage([255, 1], idpmsgTest, false);
      expect(decoded).to.be.an('Object').with.keys('name', 'codecServiceId', 'codecMessageId', 'fields');
      expect(decoded.name).to.equal('satelliteTelemetryGet');
    })
  });

});
