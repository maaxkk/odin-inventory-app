const Author = require('../models/author');
const Ad = require('../models/ad');

class AuthorService {
    async getAll() {
        try {
            return await Author.find().exec();
        } catch (e) {
            throw new Error(e);
        }
    }

    async getById(id) {
        try {
            const [author, authorAds] = await Promise.all([
                Author.findById(id).exec(),
                Ad.find({ author: id }, 'title description').exec(),
            ]);
            if (author === null) {
                return ['not exist', false];
            }
            return [author, authorAds];
        } catch (e) {
            throw new Error(e);
        }
    }

    async createAuthor(name, lastname, date_of_birth) {
        try {
            return new Author({ name: name, last_name: lastname, date_of_birth: date_of_birth });
        } catch (e) {
            throw new Error(e);
        }
    }
    async createNewUpdatedAuthor(name, last_name, date_of_birth, id) {
        try {
            return new Author({ name: name, last_name: last_name, date_of_birth: date_of_birth, _id: id });
        } catch (e) {
            throw new Error(e);
        }
    }
    async updatePost(author, id) {
        try {
            return await Author.findByIdAndUpdate(id, author, {});
        } catch (e) {
            throw new Error(e);
        }
    }

    async deleteAuthor(id) {
        try {
            return await Author.findByIdAndDelete(id);
        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new AuthorService();
