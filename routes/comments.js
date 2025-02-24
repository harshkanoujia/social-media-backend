const express = require('express')
const { Post } = require('../models/Post')
const { Comment, validateComment } = require('../models/Comment')
const router = express.Router()


// comment create
router.post('/', async ( req, res ) => {
    try {
        const { error } = validateComment( req.body )
        if( error ) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: error.details[0].message }})
        
        const isPostExist = await Post.findOne({ _id: req.body.postId })
        if ( !isPostExist) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not found'}})

        const updateComment = new Comment({
            postId: req.body.postId,
            userId: req.body.userId,
            comment: req.body.comment
        })
        await updateComment.save()

        return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: updateComment }})
    } catch (error) {
        console.log(error)
        return res.status(500).send({ statusCode: 500, message: 'Server Error', Error: error.message})
    }
})
 
// get comments
router.get('/', async ( req, res ) => {

    const regex = new RegExp(req.query.text, "i")
    let criteria = { comment: regex}
   
    const countLikes = await Comment.aggregate([
        {
            $facet: {
                Document: [
                    { $match: criteria },
                    {
                        $lookup: {
                            from: "users",
                            let: { 
                                user: { $toObjectId: "$userId" }
                            },
                            pipeline: [
                                {
                                        $match: {
                                            $expr: {
                                                $eq: [ "$_id", "$$user" ]
                                            }
                                        }
                                }
                            ],
                            as: 'User Details'
                        }
                    },
                    {
                        $lookup: {
                            from: "posts",
                            let: { 
                                post: { $toObjectId: "$postId" }
                            },
                            pipeline: [
                                {
                                        $match: {
                                            $expr: {
                                                $eq: [ "$_id", "$$post" ]
                                            }
                                        }
                                }
                            ],
                            as: 'Post Details'
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            comment: 1,
                            'User Details': 1,
                            'Post Details': 1
                        }
                    }
                ],
                totalCount: [{ $count: 'count' }]
            }
        },
        {
            $unwind: "$totalCount"
        }
    ])

    const Document = countLikes.length === 0 ? [] : countLikes[0].Document
    const TotalCount = countLikes.length === 0 ? 0 : countLikes[0].totalCount.count
    
    return res.status(200).send({ statusCode: 200, message: 'Success', data: { Document, TotalCount } })
})

// comment update
router.put('/:id', async ( req, res ) => {

    if ( !mongoose.Types.ObjectId.isValid(req.params.id) ) {
        return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id is not valid !' }})
    }

    try {
        const { error } = validateLikes( req.body )
        if( error ) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: error.details[0].message }})
        
        const isComment = await Comment.findOne({ _id: req.params.id })
        if ( !isComment) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not found'}})
        
        isComment.comment = req.body.comment || isComment.comment
        const result = await isComment.save()

        return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: result } })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ statusCode: 500, message: 'Server Error', Error: error.message})
    }
})

// comment delete
router.delete('/:id', async ( req, res ) => {

    if ( !mongoose.Types.ObjectId.isValid(req.params.id) ) {
        return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id is not valid !' }})
    }
    
    try {
        const commentDel = await Comment.deleteOne({ _id: req.params.id })
        if ( !commentDel) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not found'}})
        
        return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: 'Comment Remove Successfully' }})

    } catch (error) {
        console.log(error)
        return res.status(500).send({ statusCode: 500, message: 'Server Error', Error: error.message})
    }
})


module.exports = router;