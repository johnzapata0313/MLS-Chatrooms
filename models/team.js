// models/team.js
var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    name: String,
    city: String,
    state: String,
    latitude: Number,
    longitude: Number,
    stadium: String,
    founded: Number,
    colors: [String],
    logo: String  // Add this - URL to team logo image
});

module.exports = mongoose.model('Team', teamSchema);