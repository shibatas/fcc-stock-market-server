const request = require('request');
const Stock = require('../model/stocks.js');

module.exports = function(app, wss) {
    app.route('/test/')
        .get(function(req, res) {
            res.json('api test success'); 
        });

    app.route('/')
        .get(function(req, res) {

            // Serve all stock data 
            Stock.find({}, function(err, data) {
                if (err) throw err;
                res.json(data);
            });
        })
        .post(function(req, res, next) {
            // Add a stock symbol
            // Access external api to get stock data and store to DB
            function postStock(data, name) {
                let newStock = new Stock;
                    // symbol: String, 
                    // updated: { type: Date, default: Date.now },
                    // data: [{
                        // date: {type: Date},
                        // value: Number
                    // }]
                newStock.symbol = data['Meta Data']['2. Symbol'];
                newStock.name = name;
        
                let dataFormatted = [];
                let obj = data['Time Series (Daily)'];
                for (const prop in obj) {
                    dataFormatted.push({
                        date: new Date(prop),
                        value: obj[prop]['4. close']
                    });
                }
        
                newStock.data = dataFormatted;
        
                newStock.save(function(err, data) {
                    if (err) throw err;
                });

                wss.clients.forEach(function (client) {
                    if (client.readyState) {
                        client.send('Update');
                    }
                });

                res.send('New stock added');
            }
            
            
            const symbol = req.body.symbol;
            const name = req.body.name;
            
            if (symbol) {
                Stock.findOne({ symbol: symbol }, function(err, data) {
                    if (err) throw err;
                    if (data) {
                        res.send('Stock already exists');
                    } else {
                        let timeParam = '&function=TIME_SERIES_DAILY';
                        let symbolParam = '&symbol=' + symbol;
                        let url = process.env.STOCK_API_URL + timeParam + symbolParam;
            
                        request.get(url, function(err, req, res) {
                            if (err) throw err;
                            postStock(JSON.parse(res), name);
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
                    wss.clients.forEach(function (client) {
                        if (client.readyState) {
                            client.send('Update');
                        }
                    });
                    res.send('Data found and removed');
                } else {
                    res.send('Data not found');
                }
            })
        });
        
    
    
}