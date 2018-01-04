const request = require('request');

module.exports = function(router) {

    // Go to /api to just check if API is working
    router.get('/', function(req, res) {
      res.json({ message: 'API Initialized!'});
    });

    // Yelp query
    router.get('/restaurants', function(req, res) {
      let query = 'location=Tokyo&term=restaurants';
      let list = '';
      request({
        url: process.env.YELP_APIURL + query,
        headers: {
          'Authorization': 'Bearer ' + process.env.YELP_KEY
        }
      }, function(err, data, body) {
        console.log('error', err);
        res.json(JSON.parse(body).businesses);
      });
    })
}
