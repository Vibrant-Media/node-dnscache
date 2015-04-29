# node-dnscache
A simple async cache for performing IPv4 A record DNS lookups. By default we use the standard dns module's
dns.lookup() method which uses the same lookup mechanism as your typical service (including looking in
the hosts file). You can use the useLookup config option to use the dns.resolve() mechanism but do read
the following docs

    https://nodejs.org/api/dns.html#dns_implementation_considerations

Inspiration was taken from the dnscache module from Yahoo except I thought theirs was a little
over-the-top when overriding the various standard dns module methods which I wasn't happy about.

### Installation
Install the packages:

    cd /path/to/node-dnscache
    npm install

### Usage
You can optionally specify a configuration object when instantiating a DNSCache object. If you don't
then it'll use defaults as described in the Configuration section below.

    var DNSCache = require('node-dnascache');
    var dnscache = new DNSCache();
    
    dnscache.get('www.vibrantmedia.com', function(err, addresses) {
      if (err) {
        console.log('DNS error: %s', err);
      else {
        //  useLookup = true  -> addresses is a string
        //  useLookup = false -> addresses is a array of strings
        console.dir('Addresses: ', addresses);
      }
    });
    
### Configuration
The following describes the defaults used by the optional config you can pass to the constructor.

    var config = {
      max: 1000,      //  maximum number of entries to cache
      maxAge: 120000, //  cache servers.host DNS lookups (milliseconds)
      useLookup: true //  use dns.lookup() instead of dns.resolve()
    };

If useLookup is true then a single address is returned.
If useLokouyp is false then an array of addresses is returned.

### Testing

    npm test
