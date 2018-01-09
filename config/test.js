const request = require('request');
const Bar = require('../model/bars.js');

module.exports = function(app) {
    // Yelp query
  app.route('/api/yelp')
    .get(function(req, res) {
      console.log(req.query);
      let term = 'term=' + req.query.term;
      let query = term;
      if (req.query.location) {
        let location = 'location=' + req.query.location;
        query += '&' + location;
      } else if (req.query.latitude) {
        let latitude = 'latitude=' + req.query.latitude;
        let longitude = 'longitude=' + req.query.longitude;
        query += '&' + latitude + '&' + longitude;
      }
      console.log(query);
      request({
        url: process.env.YELP_APIURL + '?' + query,
        headers: {
          'Authorization': 'Bearer ' + process.env.YELP_KEY
        }
      }, function(err, data, body) {
        if (err) throw err;
        res.json(JSON.parse(body).businesses);
      });
    })
  
  // Process Yelp query results
  app.route('/api/bars')
    .post(function(req, res) {
      Bar.findOne({
          'id': req.body.id
        }, function(err, doc) {
        if (err) throw err;
        if (doc) {
          //console.log('found', doc);
          doc.name = req.body.name;
          doc.image_url = req.body.image_url;  
          // update doc in case yelp data is changed
          doc.save(function(err, updatedDoc) {
            if (err) throw err;
            res.json(updatedDoc);
          });
        } else {
          //console.log('not found');
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
    });
  
  // Get a single document from database
  app.route('/api/bars/:id')
    .get(function (req, res) {
      //console.log(req.params.id);
      //console.log('get bar info by id');
      Bar.findOne({
        'id': req.params.id
      }, function(err, doc) {
        if (err) throw err;
        if (doc) {
          res.json(doc);
        }
      });
    });
  
  app.route('/api/going')
    .post(function(req, res) {
      if (req.isAuthenticated()) {
        Bar.findOne({
          id: req.body.barId
        }, function(err, doc) {
          if (err) throw err;
          if (doc) {
            console.log('found', doc);
            doc.going.push({
              id: req.body.userId
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
      } else {
        res.send('User not logged in');
      }
    })
  .delete(function(req, res) {
    // delete Going entry if user clicks on "I am going" button
    console.log('delete', req.body);
    Bar.findOne({ id: req.body.barId }, function(err, doc) {
      if (err) throw err;
      if (doc) {
        //search Going subdocument for req.body.userId and delete
        let subdocId = '';
        doc.going.forEach(item => {
          if (item.id === req.body.userId) {
            console.log('id found', item._id);
            subdocId = item._id;
          }
        });
        doc.going.id(subdocId).remove();
        console.log('document removed', doc.going);
        doc.save(function(err) {
          if (err) throw err;
          res.send('document delete success');
        });
      } else {
        console.log('error doc not found');
      }
    }); 
  });
}