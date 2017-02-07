'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Article = mongoose.model('Article');

/* handle general responseData */
let responseData = '';
exports.beforeResponse = (req, res, next) => {
    responseData = {
        code: 0,
        message: ''
    };

    next();
};


/*load comments for an article*/
exports.renderComments = (req, res) => {
    let articleId = req.query.articleid || '';

    Article.findOne({
        _id: articleId
    }).then(article => {
        responseData.comments = article.comments;
        res.json(responseData);
    });
};

/*submit comment*/
exports.submitComment = (req, res) => {
    let articleId = req.body.articleid || '';
    let postData = {
        username: req.user.username,
        postTime: new Date(),
        content: req.body.content
    };

    //find current article information
    Article.findOne({
        _id: articleId
    }).then(article => {
        article.comments.push(postData);
        return article.save();
    }).then(newArticle => {
        responseData.message = 'comment successfully';
        responseData.article = newArticle;
        res.json(responseData);
    });
};
