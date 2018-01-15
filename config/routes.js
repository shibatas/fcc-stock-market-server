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
            console.log('post request', req.body);
            
            let time = '&function=TIME_SERIES_DAILY';
            let symbol = '&symbol=' + req.body.symbol;
            let url = process.env.STOCK_API_URL + time + symbol;
                        
            request.get(url, function(err, req, res) {
                if (err) throw err;
                postStock(JSON.parse(res));
            });

            res.json('stock added')
        });
        
    function postStock(res) {
        let newStock = new Stock;
            // symbol: String, 
            // updated: { type: Date, default: Date.now },
            // data: [{
                // date: {type: Date},
                // value: Number
            // }]
        newStock.symbol = res['Meta Data']['2. Symbol'];

        let obj = res['Time Series (Daily)'];
        for (const prop in obj) {
            console.log(prop);
            

        }

            //.forEach(item => {
                //console.log(item.keys());
                //return {
                    //date: new Date(item.keys()),
                    //value: 
                //};
            //})

        //newStock.data = data['Time Series (Daily)'];

        console.log('new data', newStock);
    }
    
}