const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log(`Connected to MongoDB ${MONGO_URI}`)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
  }
}

module.exports = { connectMongoDB };
