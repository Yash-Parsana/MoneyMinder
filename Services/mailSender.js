const nodemailer = require('nodemailer')
const emailTemplet = require('../constant/emailtemplate')

const verify = async(req,res,message,link,email) => {
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "yashcode2003@gmail.com",
            pass:"mkrwzwitgiiuisgs"
        }
    })

    await transporter.sendMail({
        from: `MoneyMinder<yashcode2003@gmail.com>`,
        to: email,
        subject: "Verify your mail",
        html: emailTemplet({
            message: message,
            link: link,
            expires: "10 minutes"
            
        })
    }, (err, info) => {
        if (err) {
            console.log("Error");
            res.status(500).json({
                message:"Can't Send mail"
            })
        }
        else {
            res.status(200).json({
                message:"Mail has been sent"
            })
        }
    })

}

module.exports=verify