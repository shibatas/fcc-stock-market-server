const request = require('request');
const Bar = require('../model/bars.js');

module.exports = function(router) {

    // Go to /api to just check if API is working
    router.get('/', function(req, res) {
      res.json({ message: 'API Initialized!'});
    });

    // Yelp query
    router.get('/yelp', function(req, res) {
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

    // Process Yelp query results
    router.post('/bars', function(req, res) {
      Bar.findOne({
          'id': req.body.id
        }, function(err, doc) {
        if (err) throw err;
        if (doc) {
          console.log('found', doc);
          doc.name = req.body.name;
          doc.image_url = req.body.image_url;  
          // update doc in case yelp data is changed
          doc.save(function(err, updatedDoc) {
            res.json(updatedDoc);
          });
        } else {
          console.log('not found');
          let newBar = new Bar;
          newBar.id = req.body.id;
          newBar.name = req.body.name;
          newBar.image_url = req.body.image_url;
          newBar.going = [];
          newBar.save(function(err) {
            if (err) { throw err; }
            else { res.json(newBar); }
          });
        }
      });
    })

    router.post('/going', function(req, res) {
      Bar.findOne({
          'id': req.body.id
        }, function(err, doc) {
        if (err) throw err;
        if (doc) {
          console.log('found', doc);
          doc.going.push({
            username: req.body.username
          });
          doc.save(function(err, updatedDoc) {
            if (err) throw err;
            console.log('updated doc', updatedDoc);
            res.json(updatedDoc);
          });
        } else {
          console.log('error doc not found');
        }
      });
    })
}
