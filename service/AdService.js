const Category = require('../models/category');
const Ad = require('../models/ad');
const Author = require('../models/author');

class AdService {
    async getAll() {
        try {
            return await Ad.find({}, 'title author').sort({ title: 1 }).populate('author').exec();
        } catch (e) {
            throw new Error(e);
        }
    }

    async getById(id) {
        try {
            const ad = await Ad.findById(id).sort({ title: 1 }).populate('category').populate('author').exec();
            if (ad === null) {
                return 'not exist';
            }
            return ad;
        } catch (e) {
            throw new Error(e);
        }
    }

    async createAd(title, description, author, category, password, image) {
        try {
            return new Ad({
                title: title,
                description: description,
                author: author,
                category: category,
                password: password,
                img: image,
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    async createNewUpdatedAuthor(title, description, author, category, password, id, image) {
        try {
            return new Ad({
                title: title,
                description: description,
                author: author,
                category: category,
                password: password,
                img: image,
                _id: id,
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    async updatePost(ad, id) {
        try {
            return await Ad.findByIdAndUpdate(id, ad, {});
        } catch (e) {
            throw new Error(e);
        }
    }

    async deleteAd(id, confirmPassword) {
        try {
            const ad = await Ad.findById(id);
            if (confirmPassword == ad.password) {
                await Ad.findByIdAndDelete(id);
                return 'successful';
            } else {
                return 'rejected';
            }
        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new AdService();
