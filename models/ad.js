const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdSchema = new Schema({
    title: {type: String, required: true},
    category: [{type: Schema.Types.ObjectId, ref: 'Category', required: true}],
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    password: {type: Number, required: true, maxLength: 4},
    description: {type: String, required: true, maxLength: 250},
    img: {type: String},
})

AdSchema.virtual('url').get(function () {
    return `/catalog/ad/${this._id}`;
})

module.exports = mongoose.model('Ad', AdSchema)