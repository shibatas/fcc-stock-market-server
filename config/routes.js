const request = require('request');
const Stock = require('../model/stocks.js');

module.exports = function(app) {
    app.route('/test/')
        .get(function(req, res) {
            res.json('api test success'); 
        });

    app.route('/')
        .get(function(req, res) {
            // Serve all stock data 
            Stock.find({}, function(err, data) {
                res.json(data);
            });
        })
        .post(function(req, res, next) {
            // Add a stock symbol
            // Access external api to get stock data and store to DB
            function postStock(input) {
                let newStock = new Stock;
                    // symbol: String, 
                    // updated: { type: Date, default: Date.now },
                    // data: [{
                        // date: {type: Date},
                        // value: Number
                    // }]
                newStock.symbol = input['Meta Data']['2. Symbol'];
        
                let data = [];
                let obj = input['Time Series (Daily)'];
                for (const prop in obj) {
                    data.push({
                        date: new Date(prop),
                        value: obj[prop]['4. close']
                    });
                }
        
                newStock.data = data;
        
                newStock.save(function(err, data) {
                    if (err) throw err;
                });
                res.send('New stock added');
            }

            console.log('post request', req.body);

            if (req.body.symbol) {
                Stock.findOne({ symbol: req.body.symbol }, function(err, data) {
                    if (err) throw err;
                    if (data) {
                        res.send('Stock already exists');
                    } else {
                        let time = '&function=TIME_SERIES_DAILY';
                        let symbol = '&symbol=' + req.body.symbol;
                        let url = process.env.STOCK_API_URL + time + symbol;
            
                        request.get(url, function(err, req, res) {
                            if (err) throw err;
                            postStock(JSON.parse(res));
                        });
                    }
                });    
            } else {
                res.send('POST: Invalid query data');
            }
        })
        .delete(function(req, res) {
            console.log('delete', req.query);
            Stock.findOne({ symbol: req.query.symbol }, function(err, data) {
                if (err) throw err;
                if (data) {
                    data.remove();
                    res.send('Data found and removed');
                } else {
                    res.send('Data not found');
                }
            })
        });
        
    
    
}