const AdService = require('../service/AdService')
const AuthorService = require('../service/AuthorService')
const CategoryService = require('../service/CategoryService')
const {validationResult} = require("express-validator");
const cloudinary = require('../utils/cloudinary')

class adController {
    async getAll(req, res, next) {
        try {
            const ads = await AdService.getAll()
            res.render('ad_list', {title: 'Ad list', ad_list: ads})
        } catch (e) {
            return next(e)
        }
    }

    async getById(req, res, next) {
        try {
            const ad = await AdService.getById(req.params.id)
            if (ad === 'not exist') {
                res.redirect('catalog/ad')
            }
            res.render('ad_detail', {title: 'Ad detail', ad: ad})
        } catch (e) {
            return next(e)
        }
    }

    async createGet(req, res, next) {
        try {
            const [categories, authors] = await Promise.all([
                CategoryService.getAll(),
                AuthorService.getAll(),
            ])
            res.render('ad_form', {title: 'Create Ad', categories: categories, authors: authors})
        } catch (e) {
            return next(e)
        }
    }

    async createPost(req, res, next) {
        try {
            const errors = validationResult(req);
            const {title, description, author, category, password} = req.body;
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products",
            })
            console.log(result)
            const ad = await AdService.createAd(
                title, description, author, category, password, result.secure_url);
            // validate form
            if (!errors.isEmpty()) {
                const [categories, authors] = await Promise.all([
                    CategoryService.getAll(),
                    AuthorService.getAll(),
                ])
                for (let category of categories) {
                    for(let adCategory of ad.category) {
                        if (adCategory._id.toString() === category._id.toString()) {
                            category.checked = true;
                        }
                    }
                }
                res.render('ad_form', {
                    title: 'Create Ad',
                    ad: ad,
                    authors: authors,
                    categories: categories,
                    errors: errors.array(),
                })
            } else {
                // Form validation was successful
                await ad.save();
                res.redirect(ad.url);
            }
        } catch (e) {
            return next(e)
        }
    }

    async updateGet(req, res, next) {
        try {
            const ad = await AdService.getById(req.params.id)
            const [categories, authors] = await Promise.all([
                CategoryService.getAll(),
                AuthorService.getAll(),
            ])
            if (ad === 'not exist') {
                res.redirect('catalog/ad')
            }
            for (let category of categories) {
                for(let adCategory of ad.category) {
                    if (adCategory._id.toString() === category._id.toString()) {
                        category.checked = true;
                    }
                }
            }
            res.render('ad_form_confirm', {
                title: 'Update ad',
                ad: ad,
                authors: authors,
                categories: categories,
            })
        } catch (e) {
            return next(e)
        }
    }

    async updatePost(req, res, next) {
        try {
            const errors = validationResult(req);
            const {title, description, author, category, password, confirmPassword} = req.body;
            const oldAd = await AdService.getById(req.params.id)
            if (oldAd.password != confirmPassword) {
                console.log(errors.errors.push({msg: 'Confirm password is not correct'}))
            }
            const ad = await AdService.createNewUpdatedAuthor(
                title, description, author, category, password, req.params.id);
            // validate form
            if (!errors.isEmpty()) {
                const [categories, authors] = await Promise.all([
                    CategoryService.getAll(),
                    AuthorService.getAll(),
                ])
                for (let category of categories) {
                    if (ad.category.includes(category._id)) {
                        category.checked = true;
                    }
                }
                res.render('ad_form_confirm', {
                    title: 'Update Ad',
                    ad: ad,
                    authors: authors,
                    categories: categories,
                    errors: errors.array(),
                })
            } else {
                // Form validation was successful
                const newAd = await AdService.updatePost(ad, req.params.id);
                res.redirect(newAd.url);
            }
        } catch (e) {
            return next(e)
        }
    }

    async deleteGet(req, res, next) {
        try {
            const ad = await AdService.getById(req.params.id)
            if (ad === 'not exist') {
                res.redirect('/catalog/ad')
                return;
            }
            res.render('ad_delete', {
                title: 'Delete ad',
                ad: ad,
            })
        } catch (e) {
            return next(e)
        }
    }

    async deletePost(req, res, next) {
        try {
            const confirmPassword = req.body.confirmPassword
            const result = await AdService.deleteAd(req.params.id, confirmPassword)
            const ad = await AdService.getById(req.params.id)
            if (result === 'successful') {
                res.redirect('/catalog/ad')
            } else {
                res.render('ad_delete', {
                    title: 'Delete ad',
                    ad: ad,
                    error: 'Password is not correct',
                })
            }
        } catch (e) {
            return next(e)
        }
    }
}

module.exports = new adController()