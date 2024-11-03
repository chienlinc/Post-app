require('dotenv').config()
const express = require('express')
const app = express();
const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI
const APP_PORT = process.env.APP_PORT || 3000

mongoose.connect(MONGO_URI)
    .then(() => console.log(`Connecting to MongoDB ${MONGO_URI}`))
    .catch((error) => console.error('MongoDB connection error:', error));

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.redirect("/posts")
});

const postRouter = require('./routes/posts')
app.use('/posts', postRouter)

app.listen(APP_PORT, function(){
    console.log(`app listening on port ${APP_PORT}`);
});

module.exports = app
