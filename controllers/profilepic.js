const aws = require('aws-sdk')
// const multer = require('multer')
const sharp = require('sharp')
const pool=require('../database/db')

aws.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
})

const s3=new aws.S3()


const saveImage = (req, res) => {
    
    const {email}=req.body
    const profile = req.file
    // console.log(email);

    if (!profile)
    {
        console.log("File not Found");
        res.status(400).json({
            message:"File not found"
        })
    }
    else {
        const buffer = profile.buffer
        sharp(buffer)
            .resize(500, 500)
            .jpeg({quality:50})
            .toBuffer((err, buf) => {
                if (err)
                {
                    console.log("Error in image comprassion ",err);
                }
                const params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: `profile/${profile.originalname}`,
                    Body: buf,
                    ACL: 'public-read',
                    ContentDisposition: 'inline',
                    ContentType: 'image/jpeg',
                }
                s3.upload(params, (err, data) => {
                    if (err) {
                      console.error(err);
                      res.status(500).send('Error uploading file');
                    } else {
                        const url = data.Location
                        console.log("Email : ", email)
                        const query = `update users set profile='${url}' where email='${email}'`;
                        console.log(query);
                        pool.query(query, (err, result) => {
                            if (err)
                            {
                                console.log("Error while storing image link :", err);
                                res.status(500).json({
                                    message:`Error while storing image link : ${err}`
                                })
                            }
                            else {
                                console.log(result);
                                res.status(200).json({
                                    message: "Updated",
                                    link:url
                                })
                            }
                      })
                    }
                  });
        })
    }

}
module.exports={saveImage}