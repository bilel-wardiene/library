const mongoose = require('mongoose')
var userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String
})

var User = mongoose.model('user',userSchema)
module.exports = User;

