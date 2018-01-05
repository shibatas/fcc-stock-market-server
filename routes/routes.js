const request = require('request');

module.exports = function(router) {

    // Go to /api to just check if API is working
    router.get('/', function(req, res) {
      res.json({ message: 'API Initialized!'});
    });

    // Yelp query
    router.get('/restaurants', function(req, res) {
      console.log(req.query);
      let location = 'location=' + req.query.location;
      let term = 'term=' + req.query.term;
      let query = location + '&' + term;
      request({
        url: process.env.YELP_APIURL + query,
        headers: {
          'Authorization': 'Bearer ' + process.env.YELP_KEY
        }
      }, function(err, data, body) {
        if (err) throw err;
        res.json(JSON.parse(body).businesses);
      });
    })
}
