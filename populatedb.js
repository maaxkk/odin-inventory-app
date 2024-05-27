#! /usr/bin/env node

console.log(
    'This script populates some test ads, authors, genres and adinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Ad = require('./models/ad');
const Author = require('./models/author');
const Category = require('./models/category');

const categories = [];
const authors = [];
const ads = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch(err => console.log(err));

async function main() {
    console.log('Debug: About to connect');
    await mongoose.connect(mongoDB);
    console.log('Debug: Should be connected?');
    await createCategories();
    await createAuthors();
    await createAds();
    console.log('Debug: Closing mongoose');
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
    const category = new Category({ name: name });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
}

async function authorCreate(index, name, last_name, d_birth) {
    const authordetail = { name: name, last_name: last_name };
    if (d_birth != false) authordetail.date_of_birth = d_birth;

    const author = new Author(authordetail);

    await author.save();
    authors[index] = author;
    console.log(`Added author: ${name} ${last_name}`);
}

async function adCreate(index, title, description, password, category, author) {
    const addetail = {
        title: title,
        description: description,
        password: password,
        category: category,
        author: author,
    };
    if (category != false) addetail.category = category;

    const ad = new Ad(addetail);
    await ad.save();
    ads[index] = ad;
    console.log(`Added ad: ${title}`);
}

async function createCategories() {
    console.log('Adding categories');
    await Promise.all([categoryCreate(0, 'Restaurants'), categoryCreate(1, 'Apartments'), categoryCreate(2, 'Other')]);
}

async function createAuthors() {
    console.log('Adding authors');
    await Promise.all([
        authorCreate(0, 'Patrick', 'Rothfuss', '1973-06-06'),
        authorCreate(1, 'Ben', 'Bova', '1932-11-8'),
        authorCreate(2, 'Isaac', 'Asimov', '1920-01-02'),
        authorCreate(3, 'Bob', 'Billings', false),
        authorCreate(4, 'Jim', 'Jones', '1971-12-16'),
    ]);
}

async function createAds() {
    console.log('Adding Ads');
    await Promise.all([
        adCreate(
            0,
            'Welcome to our pizzeria, only until ....',
            'We have big discount until 1st July',
            '1111',
            [categories[0]],
            authors[0]
        ),
        adCreate(
            1,
            'Welcome to our cool bar, only until ....',
            'We have big discount until 1st July',
            '1111',
            [categories[0]],
            authors[0]
        ),
        adCreate(
            2,
            'Welcome to our new bar, only until ....',
            'We have big discount until 1st July',
            '1111',
            [categories[0]],
            authors[0]
        ),
        adCreate(
            3,
            'Welcome to our sushi bar, only until ....',
            'We have big discount until 1st July',
            '1111',
            [categories[0]],
            authors[1]
        ),
        adCreate(
            4,
            'Welcome to our mcdonalds, only until ....',
            'We have big discount until 1st July',
            '1111',
            [categories[0]],
            authors[1]
        ),
        adCreate(
            5,
            'Welcome to our Mongo Plaza, only until july',
            'We have big discount until 1st July on all apartments',
            '1111',
            [categories[1]],
            authors[4]
        ),
        adCreate(
            6,
            'Welcome to our nail shop, only until  1st july',
            'We have big discount until 1st July',
            '1111',
            [categories[2]],
            authors[4]
        ),
    ]);
}
