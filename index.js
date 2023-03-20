const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const app = express();
// const multer = require('multer')
// const uploadFile = multer( +

dotenv.config({path:'.env'})

app.set('view engine','ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


const authRouter = require('./routers/authRouter')
const profilePicRouter=require('./routers/profilepicRouter')

app.get("/", (req, res) => {
    res.send("Default Page...")
})

// app.post('/profilepic/save', uploadFile.single('profile'),(req, res) => {
//     console.log(req.file);
// })
app.use('/auth', authRouter)
app.use('/profilepic',profilePicRouter)

app.listen(3000,console.log("App is Listening on Port : ",3000))