'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Going = new Schema({
    id: String,
    timestamp: {type: Date, default: Date.now}
});

const BarsSchema = new Schema({
    id: String, 
    name: String,
    image_url: String,
    going: [Going] // array of users who are going
}, {usePushEach: true});

module.exports = mongoose.model('Bar', BarsSchema);