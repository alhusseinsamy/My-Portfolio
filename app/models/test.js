var mongoose = require('mongoose');

// example schema
var schema = mongoose.Schema({
    img: { data: Buffer, contentType: String }
});

// our model
var A = mongoose.model('A', schema);

module.exports = A;