'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StocksSchema = new Schema({
    symbol: String, 
    updated: { type: Date, default: Date.now },
    data: [{
        date: {type: Date},
        value: Number
    }]
});

module.exports = mongoose.model('Stock', StocksSchema);