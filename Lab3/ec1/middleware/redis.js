var redis = require("redis");

  // Add your cache name and access key.
var client = redis.createClient(6380,'libapp.redis.cache.windows.net', {auth_pass: 'UwWkzqTMLtBWKWlh04KTwj/lzXWy9LixtNOf/bhiIgA=', tls: {servername: 'libapp.redis.cache.windows.net'}});
// client.set("key1", "value", function(err, reply) {
//         console.log(reply);
//     });
//
// client.get("key1",  function(err, reply) {
//         console.log(reply);
//     });


module.exports = client;
