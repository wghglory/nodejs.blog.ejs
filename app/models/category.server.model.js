// Invoke 'strict' JavaScript mode
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        // Set a unique 'username' index
        unique: true,
        // Validate 'username' value existance
        required: 'category name is required'
    }
});

// Create the 'Category' model out of the 'CategorySchema'
mongoose.model('Category', CategorySchema);
