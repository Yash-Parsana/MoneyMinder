const router = require('express').Router()
const auth = require('../controllers/auth')
const verifyToken=require('../Services/verifyToken')


router.post('/signup', auth.signUp)
router.post('/login', auth.login)
router.post('/pass/resetmail', auth.forgotPass)
router.get('/resetpass/:token', verifyToken, (req, res) => {
    res.render('passwordreset',{token:req.params.token})
})
router.post('/resetpass', auth.saveNewPass)

router.get('/verify/:token',verifyToken,auth.saveUser)


module.exports=router
