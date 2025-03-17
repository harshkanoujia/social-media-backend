const mongoose = require('mongoose');


module.exports = function (req, res, next) {
    if (! mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, msg: 'Invalid ID !' });
    }

    next();
}