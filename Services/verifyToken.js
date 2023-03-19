const jwt = require('jsonwebtoken')

const verifyToken = (req, res,next) => {
    const token = req.params.token
    let obj;
    try {
        obj = jwt.verify(token, process.env.JWTKEY)
    }
    catch (err)
    {
        res.status(400).json({message:"Invalid token"})
        
    }
    if (obj) {
        req.obj = obj
        next()
    }
}
module.exports=verifyToken