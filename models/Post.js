const Joi = require('joi')
const mongoose = require('mongoose')

const Post = mongoose.model('Post', new mongoose.Schema( {
    title: { type: String },
    count: { type: Number }
}))

function validatePost(body) {
    const Schema = Joi.object({
        title: Joi.string().required(),
    })
    return Schema.validate(body)
}

module.exports = {
    Post,
    validatePost
};