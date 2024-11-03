import request from 'supertest'
import { createRequire } from 'module'
import { expect } from 'chai'
import sinon from 'sinon'
const require = createRequire(import.meta.url)
require('dotenv').config()
const cheerio = require("cheerio")
const express = require("express")
const app = express()

const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI_TEST
const Post = require('../models/post.js')

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set("view engine", "ejs")

const postRouter = require("../routes/posts")
app.use("/posts", postRouter)

describe("Posts API Integration Test", () => {
    before(async () => {
        await mongoose.connect(MONGO_URI)
        await Post.deleteMany({})
    })

    after(async () => {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })

    describe("GET /posts", () => {
        it("should fetch posts and render the post list page", async () => {
            
            // create posts stored in database
            const post1 = new Post({
                locationName: "Test Location 1",
                locationDescription: "Test Description 1"
            })
            const post2 = new Post({
                locationName: "Test Location 2",
                locationDescription: "Test Description 2"
            })
            await post1.save()
            await post2.save()

            const res = await request(app).get("/posts")

            // verify the response
            expect(res.status).to.equal(200)
            expect(res.type).to.equal("text/html")

            // verify the html content
            const $ = cheerio.load(res.text)
            expect($(".post-list .post-card").length).to.equal(2)
            expect($(".post-card").first().find("h2").text()).to.equal(post2.locationName)
            expect($(".post-card").first().find("p").first().text()).to.include(post2.locationDescription)
            await Post.deleteMany({});
        })

        it("should handle errors while fetching posts", async () => {
            const findStub = sinon.stub(Post, 'find').rejects(new Error("Database fetching error"))

            const res = await request(app).get("/posts")

            // verify the response
            expect(res.status).to.equal(500)
            expect(res.text).to.equal("Error fetching posts")

            findStub.restore()
        })
    })

    describe("GET /posts/create", () => {
        it("should render the create post form", async () => {
            const res = await request(app).get("/posts/create")

            // verify the response
            expect(res.status).to.equal(200)
            expect(res.type).to.equal("text/html")

            // verify the html content
            const $ = cheerio.load(res.text)
            expect($(".header-container h1").text()).to.equal("Create a New Post")
            
            expect($("form").attr("action")).to.equal("/posts/create")
            expect($("form").attr("method")).to.equal("POST")
            expect($("form .form-field").length).to.equal(2)

            expect($("input#name").attr("name")).to.equal("locationName")
            expect($("input#name").attr("required")).to.not.be.undefined
            expect($("textarea#description").attr("name")).to.equal("locationDescription")
            expect($("textarea#description").attr("required")).to.not.be.undefined

            expect($("button[type='submit']").text()).to.equal("Create")
        })
    })

    describe("POST /posts/create", () => {
        it("should create a new post and redirect", async () => {
            const newPost = {
                locationName: "Test Location",
                locationDescription: "Test Description"
            }

            const res = await request(app)
                .post("/posts/create")
                .send(newPost)

            // verify the response
            expect(res.status).to.equal(302)
            expect(res.headers.location).to.equal("/posts")

            // verify the data was saved successfully
            const savedPost = await Post.find({ locationName: "Test Location"})
            expect(savedPost).to.have.lengthOf(1)
            expect(savedPost[0].locationDescription).to.equal(newPost.locationDescription)
        })

        it("should return a validation error when required fields are missing", async () => {
            const invalidPost = {}

            const res = await request(app)
                .post("/posts/create")
                .send(invalidPost)

            // verify the response
            expect(res.status).to.equal(400)
            expect(res.text).to.equal("Validation error: Missing required fields.")

            // verify no data was saved successfully
            const savedPost = await Post.find({})
            expect(savedPost).to.have.lengthOf(1)
        })

        it("should return 500 if there is an error saving the post", async () => {
            const postStub = sinon.stub(Post.prototype, 'save').throws(new Error("Database save error"))

            const res = await request(app)
                .post("/posts/create")
                .send({
                    locationName: "Test Location",
                    locationDescription: "Test Description"
                })
            
            // verify the response
            expect(res.status).to.equal(500);
            expect(res.text).to.equal("Error saving a post")

            // verify no data was saved successfully
            const savedPost = await Post.find({})
            expect(savedPost).to.have.lengthOf(1)

            postStub.restore()
        })
    })
})