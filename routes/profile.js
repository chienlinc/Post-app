const express = require("express")
const router = express.Router()
const { getUserDetail, insertUserToOracleDB } = require('../database/oracleDB')

router.get('/', async (req, res) => {
    try {
        await insertUserToOracleDB()
        const userData = await getUserDetail()
        if (userData) {
            const user = {
                name: userData.NAME,
                email: userData.EMAIL,
                bio: userData.BIO
            }
            res.render("profile/index", { user })
        }else{
            res.send("User not found")
        }
    } catch (error) {
        res.status(500).send("Error retrieving user data")
    }
})

module.exports = router