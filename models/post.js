const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    locationName: {
        type: String,
        required: true
    },
    locationDescription: {
        type: String,
        required: true
    },
    postedDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', postSchema)