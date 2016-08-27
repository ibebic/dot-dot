var mongoose          = require('mongoose');
var Schema            = mongoose.Schema;

var BearSchema        = new Schema({
    name: String,
    creator: String,
    dateCreated: Date,
    posX: String,
    posY: String
});

module.exports = mongoose.model('Bear', BearSchema);
