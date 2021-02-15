const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const book = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
     price: {
        type: Number,
        required: true,
    }
});
const bookModel = mongoose.model("book", book);
module.exports = bookModel;