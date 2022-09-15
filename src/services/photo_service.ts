import aws from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

/**
 * The signS3 and deleteS3 functions provided below were pulled 
 * from the old backend repo. They have been slightly edited to fit TypeScript format.
 * Hopefully they will still work as is, but they might not.
 */

export interface PhotoParams {
  fileName: string,
  fileType: string,
  link: string,
  // you will need to add other params to this
}

const signS3 = async (req: Omit<PhotoParams, 'link'>) => {
  const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: req.fileName,
    Expires: 60,
    ContentType: req.fileType,
    ACL: 'public-read',
  };
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) reject(err);

      const returnData = {
        signedRequest: data,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${req.fileName}`,
      };
      resolve(returnData);
    });
  });
};

const deleteS3 = async (req: Pick<PhotoParams, 'link'>) => {
  const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const key = req.link.replace('https://', '').replace(process.env.S3_BUCKET_NAME as string, '').replace('.s3.amazonaws.com/', '');
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: key,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(s3Params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const photoService = {
  signS3,
  deleteS3,
};

export default photoService;