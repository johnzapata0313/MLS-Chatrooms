// app/models/team.js
var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    name: String,
    city: String,
    state: String,
    latitude: Number,
    longitude: Number,
    stadium: String,
    founded: Number,
    colors: [String]
});

module.exports = mongoose.model('Team', teamSchema);