const express = require('express')
const mongoose= require('mongoose')
const dotenv = require('dotenv')
const app = express()
app.use(express.json())
dotenv.config()
console.log("db url",process.env.MONGOOSE_URL);

mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true //returns promise
}).then(() =>
    console.log("db connected"))
    .catch((err) => console.log("mongodb connection error", err))

const port = 5000

app.get('/', (req,res) => {
    return res.json({
        message: "oo papa ji oo papa ji",
        success:true
    }).status(200)
})
app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})

