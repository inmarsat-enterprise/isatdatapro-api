'use strict';

//process.env.NODE_ENV = 'production'
const chai = require('chai');
chai.config.includeStack = false;
const expect = chai.expect;
const { dateToIdpTime } = require('../../lib/ogws');


describe('#dateToIdpTime()', function () {
  const d = new Date();
  const dIso = d.toISOString();
  const expected = dIso.slice(0, 10) + ' ' + dIso.slice(11, 19);
  
  context('with Date object', function() {
    it('should return an IDP format date string', function() {
      expect(dateToIdpTime(d)).to.equal(expected);
    })
  });

  context('with ISOString', function() {
    it('should return an IDP format date string', function() {
      expect(dateToIdpTime(dIso)).to.equal(expected);
    })
  });

  context('with anything else', function() {
    it('should return "1970-01-01 00:00:00"', function() {
      expect(dateToIdpTime('other')).to.equal('1970-01-01 00:00:00');
    });
  });
});
