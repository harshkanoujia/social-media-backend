const express = require('express')
const { Post } = require('../models/Post')
const { Reply, validateReply } = require('../models/Reply')
const router = express.Router()


//reply create
router.post('/', async ( req, res ) => {
    
    const { error } = validateReply( req.body )
    if( error ) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: error.details[0].message }})
    
    const isPostExist = await Post.findOne({ _id: req.body.postId })
    if ( !isPostExist) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not found'}})
    
    const updateReply = new Reply({
        postId: req.body.postId,
        userId: req.body.userId,
        commentId: req.body.commentId,
        reply: req.body.reply
    })
    
    await updateReply.save()
    
    return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: updateReply }})

})

//reply update
router.put('/:id', async ( req, res ) => {

    if ( !mongoose.Types.ObjectId.isValid(req.params.id) ) {
        return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id is not valid !' }})
    }

    
        const { error } = validateReply( req.body )
        if( error ) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: error.details[0].message }})
        
        const isReply = await Reply.findOne({ _id: req.params.id })
        if ( !isReply) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not found'}})
        
        isReply.reply = req.body.reply || isReply.reply
        const result = await isReply.save()

        return res.status(200).send({ statusCode: 200, message: 'Success', data: { msg: result } })

})

//reply delete
router.delete('/:id', async ( req, res ) => {

    if ( !mongoose.Types.ObjectId.isValid(req.params.id) ) {
        return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id is not valid !' }})
    }
 
    const replyDel = await Reply.deleteOne({ _id: req.params.id })
    if ( !replyDel) return res.status(400).send({ statusCode: 400, message: 'Failure', data: { msg: 'Id not found'}})
    
    await replyDel.save()

})


module.exports = router;