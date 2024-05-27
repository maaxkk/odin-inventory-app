const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    date_of_birth: { type: Date },
});

AuthorSchema.virtual('full_name').get(function () {
    let full_name = '';
    if (this.name && this.last_name) {
        full_name = `${this.name} ${this.last_name}`;
    } else {
        full_name = `${this.name}`;
    }
    return full_name;
});

AuthorSchema.virtual('date_of_birth_formatted').get(function () {
    return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function () {
    return DateTime.fromJSDate(this.date_of_birth).toISODate();
});

AuthorSchema.virtual('url').get(function () {
    return `/catalog/author/${this._id}`;
});

module.exports = mongoose.model('Author', AuthorSchema);
