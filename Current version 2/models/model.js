// Step 3 - this is the code for ./models.js

var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    name: String,
    town: String,
    img: {
        data: Buffer,
        contentType: String
    },
    desc: String
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('searchtest', imageSchema);