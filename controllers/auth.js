const pool = require('../database/db')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail=require('../Services/mailSender')

const signUp = (req, res) => {
    const { name, email,password } = req.body
    
    pool.query(`select*from users where email='${email}'`, (err, result) => {
        if (err)
        {
            console.log("Error in finding user SignUP fun ",err);
            res.status(500).json({message:err})
        }
        if (result.rowCount == 1)
        {
            res.status(400).json({message:"User already Exist"})
        }
        else {
            
            const obj = {
                name,
                email,
                password
            }
            const token = jwt.sign(obj, process.env.JWTKEY, { expiresIn: 10 * 60 })
            link=process.env.DOMAIN+"auth/verify/"+token
            sendMail(req,res,"Plase verify your email to get registered.",link, email)
        }
    })

}

const saveUser = (req, res) => {
    
    let {name,email,password}=req.obj

    const Epassword=bcrypt.hashSync(password,10)

    pool.query(`insert into users (name,email,password) values('${name}','${email}','${Epassword}')`, (err, result) => {
        if (err)
        {
            console.log("Error while inserting user : ", err);
            res.status(500).json({
                success: false,
                message:"Some Error occured..."
            })
        }
        res.status(200).json({message:"Successfully SignedUp"})
    })
}
const login = (req, res) => {
    const { email, password } = req.body

    pool.query(`select*from users where email='${email}'`, async(err, result) => {
        if (err)
        {
            res.status(500).json({message:"Error occured"})
        }
        if (result.rowCount == 0)
        {
            res.status(400).json({message:"User Doen not Exist"})
        }
        else {
            const obj = result.rows[0]
            console.log(obj);
            const issame = await bcrypt.compare(password, obj.password);
            if (issame) {
                const token=await jwt.sign(obj,process.env.JWTKEY,{expiresIn:365*24*60})
                res.status(200).json({message:"Logged in successfully",token:token})
            }
            else {
                res.status(400).json({message:"Invalid Credentials"})
            }
        }
    })
}
const forgotPass = (req, res) => {
    const email = req.body.email
    
    pool.query(`select*from users where email='${email}'`, async(err, result) => {
        if (err)
        {
            console.log("Error while quering frogot pass : ",err);
            res.status(500).json({
                message:err
            })
        }
        if (result.rowCount == 0)
        {
            res.status(400).json({
                message:"User not exist"
            })
        }
        const obj = {
            email
        }
        const token = await jwt.sign(obj, process.env.JWTKEY,{expiresIn:10*60})
        const link=`${process.env.DOMAIN}auth/resetpass/${token}`
        sendMail(req,res,"Please Click on below link to reset password", link, email)
    })
}
const saveNewPass = async(req, res) => {
    const { password, token, confirmPassword } = req.body
    console.log(token, " ", password, " ",confirmPassword);
    try {
        const obj = await jwt.verify(token, process.env.JWTKEY);
        const Epass = bcrypt.hashSync(password, 10);
        pool.query(`update users set password='${Epass}' where email='${obj.email}'`, (err, result) => {
            if (err)
            {
                res.status(500).json({
                    message:"Error occured"
                })
            }
            res.status(200).json({
                message:"Password reset successfully"
            })
        })
    } catch (error) {
        console.log("Error in token verification : ",error);
        res.status(400).json({
            message:"Invalid Token"
        })
    }

}


module.exports={signUp,saveUser,login,forgotPass,saveNewPass}