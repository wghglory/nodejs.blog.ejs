'use strict';

const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Article = mongoose.model('Article');
const User = mongoose.model('User');

/*middleware */
exports.checkAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        res.render('admin/error', {
            message: 'please log in as admin',
            url: '/admin'
        });
        return;
    }
    next();
};

// Create a new controller middleware that retrieves a single existing article
exports.articleByID = function(req, res, next, id) {
    // Use the model 'findById' method to find a single article
    Article.findOne({
        '_id': id
    }).populate('user').exec(function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));

        // If an article is found use the 'request' object to pass it to the next middleware
        req.article = article;

        // Call the next middleware
        next();
    });
};

// Create a new controller middleware that retrieves a single existing category
exports.categoryByID = function(req, res, next, id) {
    // Use the model 'findById' method to find a single category
    Category.findById(id).then(category => {
        if (!category) return next(new Error('Failed to load category ' + id));

        // If an category is found use the 'request' object to pass it to the next middleware
        req.category = category;
        // Call the next middleware
        next();
    });
};
/*middleware end */

// admin index page: localhost/admin/
exports.renderAdminIndex = (req, res, next) => {
    res.render('admin/index', {
        user: req.user
    });
};

// userlist pagination: localhost/admin/user?page=1
exports.renderUsers = (req, res, next) => {
    /*
     * 从数据库中读取所有的用户数据
     *
     * limit(Number) : 限制获取的数据条数
     * skip(2) : 忽略数据的条数
     *
     * 每页显示2条
     * 1 : 1-2 skip:0 -> (当前页-1) * limit
     * 2 : 3-4 skip:2
     * */

    User.count().then(totalCount => {
        // totalCount: total record numbers in db
        let pageSize = 2; // display how many records per page
        let maxPageNumber = Math.ceil(totalCount / pageSize); // the last page number
        let page = Number(req.query.page) || 1; // 1 ≤ page ≤ maxPageNumber
        page = Math.min(page, maxPageNumber);
        page = Math.max(page, 1);

        let skipAmount = (page - 1) * pageSize;

        User.find().limit(pageSize).skip(skipAmount).then((users) => {
            res.render('admin/userlist', { //not case-sensative
                user: req.user,
                users,
                apiName: 'user',
                page,
                maxPageNumber,
                pageSize,
                totalCount,
            });
        });
    });

};

/*category list pagination: localhost/admin/category?page=1 */
exports.renderCategories = (req, res, next) => {

    Category.count().then(totalCount => {
        // totalCount: total record numbers in db
        let pageSize = 2; // display how many records per page
        let maxPageNumber = Math.ceil(totalCount / pageSize); // the last page number
        let page = Number(req.query.page) || 1; // 1 ≤ page ≤ maxPageNumber
        page = Math.min(page, maxPageNumber);
        page = Math.max(page, 1);

        let skipAmount = (page - 1) * pageSize;

        // -1 降序， 1 升序， _id在创建时考虑时间了， -1 也就按照最新到最老数据的排序
        Category.find().sort({
            _id: -1
        }).limit(pageSize).skip(skipAmount).then(categories => {
            res.render('admin/categorylist', { //not case-sensative
                user: req.user,
                categories,
                apiName: 'category',
                page,
                maxPageNumber,
                pageSize,
                totalCount
            });
        });
    });

};

exports.renderAddCategory = (req, res) => {
    res.render('admin/categoryAdd', {
        user: req.user
    });
};

exports.addCategory = (req, res) => {
    let name = req.body.name || '';
    if (name === '') {
        res.render('admin/error', {
            user: req.user,
            message: 'category name cannot be null'
        });
        return;
    }

    //check if db has existing category name
    Category.findOne({
        name
    }).then((result) => {
        if (result) { // name exists in db
            res.render('admin/error', {
                user: req.user,
                message: 'category already exists'
            });
            return Promise.reject();
        } else { //save new category to db
            return new Category({
                name
            }).save();
        }
    }).then(newCategory => {
        res.render('admin/success', {
            user: req.user,
            message: 'save category successfully',
            url: '/admin/category'
        });
    });
};

exports.renderEditCategory = (req, res, next) => {
    let id = req.category.id || '';

    Category.findOne({
        _id: id
    }).then(category => {
        if (!category) {
            res.render('admin/error', {
                user: req.user,
                message: 'category doesn\'t exist'
            });
        } else {
            res.render('admin/categoryEdit', {
                user: req.user,
                category
            });
        }
    });
};

exports.editCategory = (req, res, next) => {
    let name = req.body.name || '';
    let id = req.category.id; // req.category._id works as well
    Category.findOne({
        _id: id
    }).then(category => {
        if (!category) {
            res.render('admin/error', {
                user: req.user,
                message: 'category doesn\'t exist',
                url: '/'
            });

            return Promise.reject();
        } else {
            // admin doesn't modify name and click submit
            if (name === category.name) {
                res.render('admin/success', {
                    user: req.user,
                    message: 'update successfully',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else { // whether new name exists in db
                return Category.findOne({
                    name
                });
            }
        }
    }).then(result => { // this can be easier by setting model unique true
        if (result) { // db has already a category with same name
            res.render('admin/error', {
                user: req.user,
                message: 'db has existing name',
                url: '/admin/category'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name
            });
        }
    }).then(() => {
        res.render('admin/success', {
            user: req.user,
            message: 'update successfully',
            url: '/admin/category'
        });
    });

};

exports.deleteCategory = (req, res) => {
    let id = req.category.id || '';

    Category.remove({
        _id: id
    }).then(() => {
        res.render('admin/success', {
            user: req.user,
            message: 'delete successfully',
            url: '/admin/category'
        });
    });
};

/*article list*/
exports.renderArticles = (req, res, next) => {

    Article.count().then(totalCount => {
        // totalCount: total record numbers in db
        let pageSize = 2; // display how many records per page
        let maxPageNumber = Math.ceil(totalCount / pageSize); // the last page number
        let page = Number(req.query.page) || 1; // 1 ≤ page ≤ maxPageNumber
        page = Math.min(page, maxPageNumber);
        page = Math.max(page, 1);

        let skipAmount = (page - 1) * pageSize;

        // -1 降序， 1 升序， _id在创建时考虑时间了， -1 也就按照最新到最老数据的排序
        Article.find().limit(pageSize).skip(skipAmount).populate(['category', 'user']).sort({
            addTime: -1
        }).then(articles => {
            res.render('admin/articlelist', { //not case-sensative
                user: req.user,
                articles,
                apiName: 'article',
                page,
                maxPageNumber,
                pageSize,
                totalCount
            });
        });
    });
};

exports.renderAddArticle = (req, res, next) => {
    // load categories and choose one when add a new article
    Category.find().sort({
        _id: -1
    }).then(categories => {
        res.render('admin/articleAdd', {
            user: req.user,
            categories
        });
    });
};

exports.addArticle = (req, res, next) => {

    if (req.body.category === '') {
        res.render('admin/error', {
            user: req.user,
            message: 'article should have a category first'
        });
        return;
    }

    if (req.body.title === '') {
        res.render('admin/error', {
            user: req.user,
            message: 'article title cannot be null'
        });
        return;
    }

    new Article({
        category: req.body.category,
        title: req.body.title,
        user: req.user._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(result => {
        res.render('admin/success', {
            user: req.user,
            message: 'article saved successfully',
            url: '/admin/article'
        });
    });
};

exports.renderEditArticle = (req, res) => {
    let id = req.article.id || '';
    let categories = [];

    // load all categories to dropdown, then load the article that needs to be modified
    Category.find().sort({
        _id: -1
    }).then((result) => {
        categories = result;
        return Article.findOne({
            _id: id
        }).populate('category');
    }).then(article => { // load article in edit page
        if (!article) {
            res.render('admin/error', {
                user: req.user,
                message: 'article doesn\'t exist'
            });
        } else {
            res.render('admin/articleEdit', {
                user: req.user,
                categories,
                article
            });
        }
    });
};

exports.editArticle = (req, res) => {
    let id = req.article.id || '';

    if (req.body.category === '') {
        res.render('admin/error', {
            message: 'article must have a category'
        });
        return;
    }

    if (req.body.title === '') {
        res.render('admin/error', {
            message: 'article title cannot be null'
        });
        return;
    }

    Article.update({
        _id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(result => {
        res.render('admin/success', {
            user: req.user,
            message: 'article saved successfully',
            url: '/admin/article/edit/' + id
        });
    });
};

exports.deleteArticle = (req, res) => {
    let id = req.article.id || '';

    Article.remove({
        _id: id
    }).then(result => {
        res.render('admin/success', {
            user: req.user,
            message: 'delete successfully',
            url: '/admin/article'
        });
    });
};
