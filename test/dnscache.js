'use strict';

var assert = require('assert');
var util = require('util');
var DNSCache = require('../dnscache');

describe('DNSCache', function() {
  it('should successfully resolve localhost because useLookup is true', function(done) {
    var dnscache = new DNSCache({max: 10, maxAge: 60000, useLookup: true});
    
    dnscache.get('localhost', function(err, addresses) {
      assert.ifError(err);
      assert.strictEqual(addresses, '127.0.0.1');
      done();
    });
  });
  
  it('should fail to resolve localhost because useLookup is false', function(done) {
    var dnscache = new DNSCache({max: 10, maxAge: 60000, useLookup: false});
    
    //  a network dns call for localhost should not return 127.0.0.1
    dnscache.get('localhost', function(err, addresses) {
      assert.ifError(err);
      done();
    });
  });
  
  it('should successfully resolve www.vibrantmedia.com with useLookup true', function(done) {
    var dnscache = new DNSCache({max: 10, maxAge: 60000, useLookup: true});
    
    dnscache.get('www.vibrantmedia.com', function(err, addresses) {
      assert.ifError(err);
      assert.strictEqual(typeof addresses, 'string');
      assert.notStrictEqual(addresses, '');
      done();
    });
  });
  
  it('should successfully resolve www.vibrantmedia.com with useLookup false', function(done) {
    var dnscache = new DNSCache({max: 10, maxAge: 60000, useLookup: false});
    
    dnscache.get('www.vibrantmedia.com', function(err, addresses) {
      assert.ifError(err);
      assert(util.isArray(addresses));
      assert(addresses.length > 0);
      done();
    });
  });
  
  it('should fail to resolve this-does.not.exist.vibrantmedia.com with useLookup true', function(done) {
    var dnscache = new DNSCache({max: 10, maxAge: 60000, useLookup: true});
    
    dnscache.get('this-does.not.exist.vibrantmedia.com', function(err, addresses) {
      //  NOTE - this *may* work if your ISP catches failed lookups and spams you with an advert
      assert(err);
      done();
    });
  });
  
  it('should fail to resolve this-does.not.exist.vibrantmedia.com with useLookup false', function(done) {
    var dnscache = new DNSCache({max: 10, maxAge: 60000, useLookup: false});
    
    dnscache.get('this-does.not.exist.vibrantmedia.com', function(err, addresses) {
      //  NOTE - this *may* work if your ISP catches failed lookups and spams you with an advert
      assert(err);
      done();
    });
  });
});
