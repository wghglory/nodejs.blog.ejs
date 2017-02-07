'use strict';

const admin = require('../../app/controllers/admin.server.controller.js');

module.exports = function(app) {

    app.use('/admin', admin.checkAdmin);

    // admin index page: localhost/admin/
    app.route('/admin').get(admin.renderAdminIndex);

    // userlist pagination: localhost/admin/user?page=1
    app.route('/admin/user').get(admin.renderUsers);

    /*category list pagination: localhost/admin/category?page=1 */
    app.route('/admin/category').get(admin.renderCategories);

    app.route('/admin/category/add').get(admin.renderAddCategory);
    app.route('/admin/category/add').post(admin.addCategory);

    app.route('/admin/category/edit/:categoryId').get(admin.renderEditCategory).post(admin.editCategory);

    app.route('/admin/category/delete/:categoryId').get(admin.deleteCategory);

    /*article list*/
    app.route('/admin/article').get(admin.renderArticles);

    app.route('/admin/article/add').get(admin.renderAddArticle).post(admin.addArticle);

    app.route('/admin/article/edit/:articleId').get(admin.renderEditArticle).post(admin.editArticle);

    app.route('/admin/article/delete/:articleId').get(admin.deleteArticle);

    // Set up the 'articleId and categoryId' parameter middleware
    app.param('articleId', admin.articleByID);
    app.param('categoryId', admin.categoryByID);
};
