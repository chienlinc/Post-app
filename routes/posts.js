const express = require("express")
const router = express.Router()
const Post = require('../models/post')

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find( {} ).sort( { postedDate: -1 } )
        res.render("posts/index", { posts })
    } catch (err) {
        console.error("Error fetching posts:", err)
        res.status(500).send("Error fetching posts")
    }
})

router.post("/create", async (req, res) => {
    const post = new Post({
        locationName: req.body.locationName,
        locationDescription: req.body.locationDescription,
    })
    try {
        await post.save()
        res.redirect("/posts");
    } catch (err){
        console.error("Error saving a post:", err);
        res.status(500).send("Error saving a post");
    }
})

router.get("/create", (req, res) => {
    res.render("posts/create")
})

module.exports = router