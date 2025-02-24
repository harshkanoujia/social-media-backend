const express = require('express')
const mongoose = require('mongoose')
const { Post } = require('../models/Post')
const { Like, validateLikes } = require('../models/Like')
const router = express.Router()


// like create
router.post('/', async (req, res) => {
    const { error } = validateLikes(req.body)
    if (error) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: error.details[0].message } })

    const isPostExist = await Post.findOne({ _id: req.body.postId })
    if (!isPostExist) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not found' } })

    const updateLikes = new Like({
        postId: req.body.postId,
        userId: req.body.userId
    })
    await updateLikes.save()

    return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: updateLikes } })
})

// get all likes 
router.get('/', async (req, res) => {

    const skip = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const countLikes = await Like.aggregate([
        {
            $match: criteria
        },
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
                                $eq: ["$_id", "$$user"]
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
                                $eq: ["$_id", "$$post"]
                            }
                        }
                    }
                ],
                as: 'Post Details'
            }
        },
        {
            $facet: {
                value: [
                    { $skip: skip },
                    { $limit: limit }
                ],
                totalCount: [{ $count: "douments" }]
            }
        },
        {
            $unwind: "$totalCount"
        }
    ])

    const Value = countLikes.length === 0 ? [] : countLikes[0].value
    const TotalCount = countLikes.length === 0 ? [] : countLikes[0].totalCount.count

    return res.status(200).send({ statusCode: 200, message: 'Success', data: { Value, TotalCount } })
})

// list of likes in post
router.get('/:id', async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id is not valid !' } })
    }


    const criteria = new mongoose.Types.ObjectId(req.params.id);
    if (!criteria) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not found' } })

    const countLikes = await Like.aggregate([
        {
            $match: {
                _id: criteria
            }
        },
        {
            $lookup: {
                from: 'users',
                let: {
                    user: { $toObjectId: '$userId' }
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$user"]
                            }
                        }
                    }
                ],
                as: "User Details"
            }
        },
        {
            $lookup: {
                from: "posts",
                let: {
                    post: { $toObjectId: '$postId' }
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$post"]
                            }
                        }
                    }
                ],
                as: "Post Details"
            }
        },
        {
            $project: {
                _id: 0,
                postId: 0,
                userId: 0,
                __v: 0
            }
        },
        {
            $facet: {
                Value: [],
                totalCount: [{ $count: 'count' }]
            }
        }
    ])

    return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: countLikes } })
})

// like delete
router.delete('/:id', async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id is not valid !' } })
    }

    const isLikeExist = await Like.deleteOne({ _id: req.params.id })
    if (!isLikeExist) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not found' } })

    return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: 'Like Remove Successfully' } })
})


module.exports = router;