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
            res.json('get data')
        })
        .post(function(req, res, next) {
            // Add a stock symbol
            // Access external api to get stock data and store to DB
            console.log(req.body);
            
            let time = '&function=TIME_SERIES_DAILY';
            let symbol = '&symbol=' + req.body.symbol;
            let url = process.env.STOCK_API_URL + time + symbol;
                        
            request.get(url, function(err, req, res) {
                if (err) throw err;
                console.log(res);
            });
            
            let newStock = new Stock;
            // symbol: String, 
            // updated: { type: Date, default: Date.now },
            // data: [{
                // date: {type: Date},
                // value: Number
            // }]
            
            newStock.symbol = req.body.symbol;

            
            res.json('stock added')
        });
        
    function postStock(data) {
        console.log(data);
    }
    
}