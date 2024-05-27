const CategoryService = require('../service/CategoryService')
const {validationResult} = require("express-validator");

class categoryController {
    async getAll(req, res, next) {
        try {
            const categories = await CategoryService.getAll()
            res.render('category_list', {title: 'Category list', category_list: categories})
        } catch (e) {
            return next(e)
        }
    }
    async getById(req, res, next) {
        try {
            const [category, adsInCategory] = await CategoryService.getById(req.params.id)
            if (category === 'not exist') {
                res.redirect('catalog/category')
            }
            res.render('category_detail', {title: 'Category detail', category: category, category_ads: adsInCategory})
        } catch (e) {
            return next(e)
        }
    }
    createGet(req, res, next) {
        try {
            res.render('category_form', {title: 'Create Category'})
        } catch (e) {
            return next(e)
        }
    }
    async createPost(req, res, next) {
        try {
            const errors = validationResult(req);
            const category = await CategoryService.createCategory(req.body.name);
            if (category[0] === 'exists') {
                res.redirect(category[1])
                return;
                // we return, category with this name already exists
            }
            // validate form
            if (!errors.isEmpty()) {
                res.render('category_form', {
                    title: 'Create Category',
                    category: category,
                    errors: errors.array(),
                })
            } else {
                // Form validation was successful
                await category.save();
                res.redirect(category.url);
            }
        } catch (e) {
            return next(e)
        }
    }
    async updateGet(req, res, next) {
        try {
            const [category, adsInCategory] = await CategoryService.getById(req.params.id)
            if (category === 'not exist') {
                res.redirect('catalog/category')
            }
            res.render('category_form', {
                title: 'Update category',
                category: category
            })
        } catch (e) {
            return next(e)
        }
    }
    async updatePost(req, res, next) {
        try {
            const errors = validationResult(req);
            const category = await CategoryService.checkIfExists(req.body.name, req.params.id);
            if (category[0] === 'exists') {
                res.redirect(category[1])
                return;
                // we return, category with this name already exists and redirect use to existed category
            }
            // validate form
            if (!errors.isEmpty()) {
                res.render('category_form', {
                    title: 'Update Category',
                    category: category,
                    errors: errors.array(),
                })
            } else {
                // Form validation was successful
                const newCategory = await CategoryService.updatePost(category,  req.params.id);
                res.redirect(newCategory.url);
            }
        } catch (e) {
            return next(e)
        }
    }

    async deleteGet(req, res, next) {
        try {
            const [category, adsInCategory] = await CategoryService.getById(req.params.id)
            if (category === 'not exist') {
                res.redirect('/catalog/category')
                return;
            }
            res.render('category_delete', {
                title: 'Delete category',
                category: category,
                ads_in_category: adsInCategory,
            })
        }  catch (e) {
            return next(e)
        }
    }
    async deletePost(req, res, next) {
        try {
            const [category, adsInCategory]  = await CategoryService.getById(req.params.id)
            if (adsInCategory.length > 0) {
                res.render('genre_delete', {
                    title: 'Delete category',
                    category: category,
                    ads_in_category: adsInCategory,
                })
            } else {
                await CategoryService.deleteCategory(req.params.id)
                res.redirect('/catalog/category')
            }
        } catch (e) {
            return next(e)
        }
    }
}

module.exports = new categoryController()