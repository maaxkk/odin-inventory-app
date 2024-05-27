const AuthorService = require('../service/AuthorService');
const { validationResult } = require('express-validator');

class authorController {
    async getAll(req, res, next) {
        try {
            const authors = await AuthorService.getAll();
            res.render('author_list', { title: 'Author list', author_list: authors });
        } catch (e) {
            return next(e);
        }
    }
    async getById(req, res, next) {
        try {
            const [author, authorAds] = await AuthorService.getById(req.params.id);
            if (author === 'not exist') {
                res.redirect('catalog/author');
            }
            res.render('author_detail', { title: 'Author detail', author: author, author_ads: authorAds });
        } catch (e) {
            return next(e);
        }
    }
    createGet(req, res, next) {
        try {
            res.render('author_form', { title: 'Create Author' });
        } catch (e) {
            return next(e);
        }
    }
    async createPost(req, res, next) {
        try {
            const errors = validationResult(req);
            const { name, last_name, date_of_birth } = req.body;
            const author = await AuthorService.createAuthor(name, last_name, date_of_birth);

            // validate form
            if (!errors.isEmpty()) {
                res.render('author_form', {
                    title: 'Create Author',
                    author: author,
                    errors: errors.array(),
                });
            } else {
                // Form validation was successful, save(create) new author
                await author.save();
                res.redirect(author.url);
            }
        } catch (e) {
            return next(e);
        }
    }
    async updateGet(req, res, next) {
        try {
            const [author, authorAds] = await AuthorService.getById(req.params.id);
            if (author === 'not exist') {
                res.redirect('catalog/author');
            }
            res.render('author_form', {
                title: 'Update author',
                author: author,
            });
        } catch (e) {
            return next(e);
        }
    }
    async updatePost(req, res, next) {
        try {
            const errors = validationResult(req);
            const { name, last_name, date_of_birth } = req.body;
            const author = await AuthorService.createNewUpdatedAuthor(name, last_name, date_of_birth, req.params.id);
            // validate form
            if (!errors.isEmpty()) {
                res.render('author_form', {
                    title: 'Update Author',
                    author: author,
                    errors: errors.array(),
                });
            } else {
                // Form validation was successful
                const newAuthor = await AuthorService.updatePost(author, req.params.id);
                res.redirect(newAuthor.url);
            }
        } catch (e) {
            return next(e);
        }
    }

    async deleteGet(req, res, next) {
        try {
            const [author, authorAds] = await AuthorService.getById(req.params.id);
            if (author === 'not exist') {
                res.redirect('/catalog/author');
                return;
            }
            res.render('author_delete', {
                title: 'Delete Author',
                author: author,
                author_ads: authorAds,
            });
        } catch (e) {
            return next(e);
        }
    }
    async deletePost(req, res, next) {
        try {
            const [author, authorAds] = await AuthorService.getById(req.params.id);
            if (authorAds.length > 0) {
                res.render('author_delete', {
                    title: 'Delete author',
                    author: author,
                    author_ads: authorAds,
                });
            } else {
                await AuthorService.deleteAuthor(req.params.id);
                res.redirect('/catalog/author');
            }
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new authorController();
