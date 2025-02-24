const Joi = require('joi');
const mongoose = require('mongoose')

const Comment = mongoose.model('Comment', new mongoose.Schema( {
    postId: { type: String },
    userId: { type: String },
    comment: { type: String }
}))

function validateComment(body) {
    const Schema = Joi.object({
        postId: Joi.string().required(),
        userId: Joi.string().required(),
        comment: Joi.string().required() 
    })
    return Schema.validate(body)
}


module.exports = {
    Comment,
    validateComment
};