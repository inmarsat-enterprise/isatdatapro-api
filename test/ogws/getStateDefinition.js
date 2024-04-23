'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const idpApi = require('../../lib/ogws');

describe('#getStateDefinition(SUBMITTED)', function() {
  let state = 0;
  let stateDef = idpApi.getStateDefinition(state);
  it('should return SUBMITTED', function() {
    expect(stateDef).to.equal('SUBMITTED');
  })
});

describe('#getStateDefinition(SENDING_IN_PROGRESS)', function() {
  let state = 8;
  let stateDef = idpApi.getStateDefinition(state);
  it('should return SENDING_IN_PROGRESS', function() {
    expect(stateDef).to.equal('SENDING_IN_PROGRESS');
  })
});
