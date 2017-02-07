// Invoke 'strict' JavaScript mode
'use strict';

const mongoose = require('mongoose');

// Define a new 'ArticleSchema'
const ArticleSchema = new mongoose.Schema({
    //ref field
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' // models/Category.js
    },
    //ref field
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    createTime: {
        type: Date,
        default: new Date() //Date.now
    },
    viewAmount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    comments: {
        type: Array,
        default: []
    }
});

mongoose.model('Article', ArticleSchema);
