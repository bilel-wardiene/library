const mongoose = require('mongoose')

var bookSchema = mongoose.Schema({
    title:String,
    description:String,
    author:String,
    price:Number,
    image:String,
    userId:String,
})

var book = mongoose.model('book',bookSchema);
module.exports = book;

