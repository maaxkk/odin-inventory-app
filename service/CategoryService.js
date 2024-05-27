const Category = require('../models/category')
const Ad = require('../models/ad')

class CategoryService {
    async getAll() {
        try {
            return await Category.find().exec();
        } catch (e) {
            throw new Error(e)
        }
    }

    async getById(id) {
        try {
            const [category, adsInCategory] = await Promise.all([
                Category.findById(id).exec(),
                Ad.find({category: id}, 'title description').exec(),
            ])
            if (category === null) {
                return ['not exist', false]
            }
            return [category, adsInCategory]
        } catch (e) {
            throw new Error(e)
        }
    }

    async createCategory(name) {
        try {
            const categoryExists = await Category.findOne({name: name})
                .collation({locale: 'en', strength: 2})
                .exec()
            if (categoryExists) {
                 return ['exists', categoryExists.url]
            }
            return new Category({name: name});
        } catch (e) {
            throw new Error(e)
        }
    }
    async checkIfExists(name, id) {
        try {
            const categoryExists = await Category.findOne({name: name})
                .collation({locale: 'en', strength: 2})
                .exec()
            if (categoryExists) {
                return ['exists', categoryExists.url]
            }
            return new Category({name: name, _id: id})
        } catch (e) {
            throw new Error(e)
        }
    }
    async updatePost(category, id) {
        try {
            return await Category.findByIdAndUpdate(id, category, {})
        } catch (e) {
            throw new Error(e)
        }
    }

    async deleteCategory(id) {
        try {
            return await Category.findByIdAndDelete(id)
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = new CategoryService()