// Invoke 'strict' JavaScript mode
'use strict';

const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Article = mongoose.model('Article');

let data;
/*handle general data*/
exports.getCategories = (req, res, next) => {
    data = {
        user: req.user,
        categories: []
    };

    Category.find().then(categories => {
        data.categories = categories;
        next();
    });
};

/*index*/
/*router.get('/', function(req, res, next) {

    // Category.find().then(categories => {
    //     res.render('main/index', {
    //         userInfo: req.userInfo,
    //         categories
    //     }); //default will be html,
    //     // pass userInfo data, if not null => user already logged in => show userinfo div.
    //     // null => user not login => show login div
    // });

    let data = {
        userInfo: req.userInfo,
        categories: [],
        category: req.query.category || '', //click javascript, html, etc. category, pass clicked category id
        totalCount: 0,
        page: Number(req.query.page) || 1,
        pageSize: 2,
        maxPageNumber: 0
    };

    // filter clicked category
    let whereCondition = {};
    if (data.category) {
        whereCondition.category = data.category; // note mongodb article table has field called "category", storing id.
    }

    Category.find().then(categories => {
        data.categories = categories;
        return Article.where(whereCondition).count();
    }).then(totalCount => {
        data.totalCount = totalCount;
        //计算总页数
        data.maxPageNumber = Math.ceil(data.totalCount / data.pageSize);
        //取值不能超过maxPageNumber
        data.page = Math.min(data.page, data.maxPageNumber);
        //取值不能小于1
        data.page = Math.max(data.page, 1);

        var skipAmount = (data.page - 1) * data.pageSize;

        return Article.where(whereCondition).find().limit(data.pageSize).skip(skipAmount).populate(['category', 'user']).sort({
            addTime: -1
        });
    }).then(function(articles) {
        data.articles = articles;
        res.render('main/index', data);
    });
});*/
exports.render = function(req, res, next) {

    data.category = req.query.category || ''; //click javascript, html, etc. category, pass clicked category id
    data.totalCount = 0;
    data.page = Number(req.query.page) || 1;
    data.pageSize = 2;
    data.maxPageNumber = 0;

    // filter clicked category
    let whereCondition = {};
    if (data.category) {
        whereCondition.category = data.category; // note mongodb article table has field called "category", storing id.
    }

    Article.where(whereCondition).count().then(totalCount => {
        data.totalCount = totalCount;
        //计算总页数
        data.maxPageNumber = Math.ceil(data.totalCount / data.pageSize);
        //取值不能超过maxPageNumber
        data.page = Math.min(data.page, data.maxPageNumber);
        //取值不能小于1
        data.page = Math.max(data.page, 1);

        var skipAmount = (data.page - 1) * data.pageSize;

        return Article.where(whereCondition).find().limit(data.pageSize).skip(skipAmount).populate(['category', 'user']).sort({
            addTime: -1
        });
    }).then(function(articles) {
        data.articles = articles;
        res.render('main/index', data);
    });
};

/*user click "read detail" to content detail */
exports.renderView = (req, res) => {
    let articleId = req.query.articleid || '';

    Article.findOne({
        _id: articleId
    }).then(article => {
        data.article = article;
        article.viewAmount++;
        article.save();

        res.render('main/view', data);
    });
};
