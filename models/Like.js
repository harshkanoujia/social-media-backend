const Joi = require('joi');
const mongoose = require('mongoose');

const Like = mongoose.model('Like', new mongoose.Schema( {
    postId: { type: String },
    userId: { type: String }
}))


function validateLikes(body) {
    const Schema = Joi.object({
        postId: Joi.string().required(),
        userId: Joi.string()
    })
    return Schema.validate(body)
}

module.exports = {
    Like,
    validateLikes
};