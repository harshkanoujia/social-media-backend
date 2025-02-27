const express = require('express')
const mongoose  = require('mongoose')
const {POST_CONSTANTS} = require('../config/constant')
const { Post, validatePost } = require('../models/Post')
const router = express.Router()


// post create
router.post('/', async ( req, res ) => {

    const { error } = validatePost( req.body )
    if( error ) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: error.details[0].message }})
    
    const createPost = new Post({
        title: req.body.title
    })
    if( !createPost ) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: POST_CONSTANTS.ERROR_WHILE_CREATE }})
    
    const result = await createPost.save()
    
    return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: result }})
})

// get all posts 
router.get('/', async ( req, res ) => {

    let criteria = {}

    const skipval = isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset)
    const limitVal = isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit) 

    if (req.query.text) {
        const regex = new RegExp(req.query.text, "i")
        criteria = { title: regex }
    }

    const countPost = await Post.aggregate([
        {
            $facet: {
                value: [ 
                    { $match: criteria },
                    { $skip: skipval },
                    { $limit: limitVal }
                ],
                TotalCount: [ { $count: 'count' }]
            }         
        },
        {
            $unwind: "$TotalCount"
        }
    ])
    
    const value = countPost.length === 0 ? [] : countPost[0].value
    const TotalCount = countPost.length === 0 ? 0 : countPost[0].TotalCount.count
    
    return res.status(200).send({ statusCode: 200, message: 'Success', data: { value:  value , TotalCount: TotalCount } })
})

// paticular post details 
router.get('/:id', async ( req, res ) => {

    if ( !mongoose.Types.ObjectId.isValid(req.params.id) ) {
        return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id is not valid !' }})
    }
         
        const countLikes = await Post.findOne({ _id: req.params.id })
        if ( !countLikes ) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not found'}})

        return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: countLikes } })

})

// post update
router.put('/:id', async ( req, res ) => {

    if ( !mongoose.Types.ObjectId.isValid(req.params.id) ) {
        return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id is not valid !' }})
    }

    
        const { error } = validatePost( req.body )
        if( error ) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: error.details[0].message }})

        const updatePost = await Post.findOne({ _id: req.params.id })
        if ( !updatePost) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not Found'}}) 

        updatePost.title = req.body.title || updatePost.title

        const result = await updatePost.save()
        return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: result }})


})

// post delete
router.delete('/:id', async ( req, res ) => {
    
    if ( !mongoose.Types.ObjectId.isValid(req.params.id) ) {
        return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id is not valid !' }})
    }
    
        const deletePost = await Post.deleteOne({ _id: req.params.id })
        if (!deletePost || deletePost.deletedCount === 0 ) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not Found'}}) 

        return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: 'Post Succussfuly Deleted' , deletePost}})


})


module.exports = router;