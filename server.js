require('dotenv').config()
const express = require('express')
const app = express();
const APP_PORT = process.env.APP_PORT || 3000
const { connectMongoDB } = require('./config/mongoConfig')
connectMongoDB()

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.redirect("/posts")
});

const postRouter = require('./routes/posts')
app.use('/posts', postRouter)

const profileRouter = require('./routes/profile')
app.use('/profile', profileRouter)

app.listen(APP_PORT, function(){
    console.log(`app listening on port ${APP_PORT}`);
});

module.exports = app
