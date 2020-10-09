const handleSignS3 = (req, res, aws) => {
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    if (!fileName || !fileType) return res.status(400).json('Wrong request');
    const s3 = new aws.S3();
    const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    try {
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err) return res.status(500).json(err);
            const returnData = {
              signedRequest: data,
              url: `https://${process.env.AWS_S3_BUCKET}.s3.${aws.config.region}.amazonaws.com/${fileName}`
            };
            return res.json(returnData);
        })    
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    handleSignS3
}