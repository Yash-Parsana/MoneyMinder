const router = require('express').Router()
const profilepicC = require('../controllers/profilepic')
const multer = require('multer')


const uploadFile = multer()

router.post('/save',uploadFile.single('profile'),profilepicC.saveImage)

module.exports=router