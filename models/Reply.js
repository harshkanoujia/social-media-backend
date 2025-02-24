const Joi = require('joi');
const mongoose = require('mongoose')

const Reply = mongoose.model('Reply', new mongoose.Schema( {
    postId: { type: String },
    userId: { type: String },
    commentId: { type: String },
    reply: { type: String }
}))

function validateReply(body) {
    const Schema = Joi.object({
        postId: Joi.string().required(),
        userId: Joi.string().required(),
        commentId: Joi.string().required(),
        reply: Joi.string().required() 
    })
    return Schema.validate(body)
}


module.exports = {
    Reply,
    validateReply
};