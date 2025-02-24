const express = require('express')
const logger = require('./logger')

// routes
const call = require('../routes/calls')
const Post  = require('../routes/posts')
const Like  = require('../routes/likes')
const Reply = require('../routes/replies')
const User  = require('../routes/users')
const Comment = require('../routes/comments')

// error hanlding
const error = require('../middleware/errorHandling')


module.exports = function (app) {
    app.use(express.json())
    app.use(logger)

    app.use('/api/call', call)
    app.use('/api/post', Post)
    app.use('/api/like', Like)
    app.use('/api/user', User)  
    app.use('/api/reply', Reply)
    app.use('/api/comment', Comment)

    app.use(error)      
}