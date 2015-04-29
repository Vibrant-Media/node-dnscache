'use strict';

var dns = require('dns');
var AsyncCache = require('async-cache');

var DEFAULT_MAX_ITEMS   = 1000;
var DEFAULT_MAX_AGE     = 1000 * 60 * 2;
var DEFAULT_USE_LOOKUP  = true; //  use dns.lookup() instead of dns.resolve()
var IP_4_ADDRESSES      = 4;

/**
 * DNSCache simply performs IPv4 A record DNS lookups and is wrapped in a cache to
 * improve performance. If you specify useLookup as true in the config (default)
 * then resolving an address returns a single IP as a string, whereas using
 * useLookup false returns an array of string IPs.
 *
 * @see https://nodejs.org/api/dns.html#dns_implementation_considerations
 * 
 * The config takes the following properties:
 *   max - the maximum number of items (default is 1000)
 *   maxAge - how old a cache item can be before it's replaced (default 2 minutes)
 *   useLookup - use dns.lookup() instead of dns.resolve() (default true)
 *
 * @param [object] config Optional config options
 */
function DNSCache(config) {
  config = config || {};
  
  this.cache = new AsyncCache({
    max: config.max || DEFAULT_MAX_ITEMS,
    maxAge: config.maxAge || DEFAULT_MAX_AGE,
    load: (config.useLookup === undefined ? DEFAULT_USE_LOOKUP : !!config.useLookup) ? 
      function(host, callback) {
        dns.lookup(host, IP_4_ADDRESSES, callback);
      } : function(host, callback) {
        dns.resolve4(host, callback);
      }
  });
}

/**
 * Get the address(es) for a host performing an actual DNS lookup
 * if necessary. The callback function is of the form callback(err, addresses)
 * where addresses is a single string with the IP address useLookup is
 * true, otherwise if useLookup is false then addresses is an array of
 * IP addresses.
 *
 * @param {string} host The host name to resolve
 * @param {function} callback Callback function (err, addresses) to pass results to
 */
DNSCache.prototype.get = function(host, callback) {
  this.cache.get(host, callback);
};

/**
 * Empty the cache of any entries.
 */
DNSCache.prototype.reset = function() {
  this.cache.reset();
};

module.exports = DNSCache;
