import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const s3 =
  ID && SECRET
    ? new S3({
      accessKeyId: ID,
      secretAccessKey: SECRET,
    })
    : null;

export const uploadImage = async ({
  key,
  buffer,
}: {
  key: string;
  buffer: Buffer;
}) => {
  if (!s3 || !BUCKET_NAME) throw new Error('Image upload not properly set up.');
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
  };
  return s3
    .upload(params)
    .promise()
    .then((data) => {
      return data.Location;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};