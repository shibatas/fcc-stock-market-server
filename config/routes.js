const request = require('request');
const Stock = require('../model/stocks.js');
const colors = require('./colors.js');

module.exports = function(app, wss) {
    function getStockData (symbol, name, next) {
        let newStock = new Stock;

        newStock.symbol = symbol;
        newStock.name = name;
        nextColor(function(color) {
            newStock.color = color;
        });
            
        const timeParam = '&function=TIME_SERIES_DAILY';
        const symbolParam = '&symbol=' + symbol;
        let url = process.env.STOCK_API_URL + timeParam + symbolParam;
        
        request.get(url, function(err, req, res) {
            if (err) throw err;
            onDataReceived(JSON.parse(res));
        });
            
        function onDataReceived (data) {
            let dataFormatted = [];
            let obj = data['Time Series (Daily)'];
            for (const prop in obj) {
                dataFormatted.push({
                    date: new Date(prop),
                    value: obj[prop]['4. close']
                });
            }
    
            newStock.data = dataFormatted;

            next(newStock);
        }
    }
    
    function nextColor(next) {
        Stock.find({}, function(err, data) {
           if (err) throw err;
           const colorsTaken = data.map(function(item) {
               return item.color;
           });
           
           const nextColor = colors.find(function(item) {
               console.log(colorsTaken.indexOf(item));
              return colorsTaken.indexOf(item) === -1; 
           });
           
           console.log(nextColor);
           
           next(nextColor);
        });
    }
    
    function notifyClients () {
        wss.clients.forEach(function (client) {
            if (client.readyState) {
                client.send('Update');
            }
        });
    }
            
            
    app.route('/test/')
        .get(function(req, res) {
            res.json('api test success'); 
        });

    app.route('/')
        .get(function(req, res) {
            // Serve all stock data
            const today = new Date().toISOString().slice(0,10);
            Stock.find({}, function(err, data) {
                if (err) throw err;
                data.forEach(function(item) {
                    const timeStamp = item.updated.toISOString().slice(0,10);
                    if (timeStamp !== today) {
                        console.log(item.symbol + ' needs updating');
                        getStockData(item.symbol, item.name, function(newStock) {
                            console.log(item.symbol, newStock.symbol);
                            newStock._id = item._id;
                            Stock.findOneAndUpdate({symbol: newStock.symbol}, newStock, function(err, data) {
                                if (err) throw err;
                                console.log(data.symbol + ' updated');
                            });
                        })
                    } else {
                        console.log(item.symbol + ' is up-to-date');
                    }
                })
                res.json(data);
            });
        })
        .post(function(req, res, next) {
            // Add a stock symbol
            // Access external api to get stock data and store to DB
            const symbol = req.body.symbol;
            const name = req.body.name;
            
            if (symbol) {
                Stock.findOne({ symbol: symbol }, function(err, data) {
                    if (err) throw err;
                    if (data) {
                        res.send('Stock already exists');
                    } else {
                        getStockData(symbol, name, function(newStock) {
                            newStock.save(function(err, data) {
                                if (err) throw err;
                                console.log(data.symbol + ' added to database');
                                notifyClients();
                                res.send(data.symbol + 'successfully added');
                            });
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
            });
        });
}