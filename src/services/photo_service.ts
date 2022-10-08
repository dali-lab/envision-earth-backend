// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import aws from 'aws-sdk';
import PhotoModel, { IPhoto } from 'db/models/photo';
import dotenv from 'dotenv';
import { DatabaseQuery } from '../constants';
import { Op } from 'sequelize';
import { BaseError } from 'errors';
import { resizeImage, uploadImage } from '../util';
// import axios from 'axios';

dotenv.config();

export interface IPhotoInput {
  uri: string,
  fileName: string,
  buffer: string, // base64
}

export interface PhotoParams {
  fileName: string,
  fileType: string,
  link: string,
}

export interface CreatePhotoRequestSchema {
  file: File,
}

export interface UpdatePhotoRequestSchema {
  link: string,
  file: File,
}

export interface PhotoS3Signature {
  signedRequest: string,
  url: string
}

const signS3 = async (file: IPhotoInput, fileName: string) => {
  const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    // ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  };
  return new Promise<PhotoS3Signature>((resolve, reject) => {
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) reject(err);

      const returnData: PhotoS3Signature = {
        signedRequest: data,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
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

const constructQuery = (params: PhotoParams) => {
  const { fileName, fileType, link } = params;
  const query: DatabaseQuery<PhotoParams> = {
    where: {},
  };
  if (fileName) {
    query.where.fileName = {
      [Op.eq]: fileName,
    };
  }
  if (fileType) {
    query.where.fileType = {
      [Op.eq]: fileType,
    };
  }
  if (link) {
    query.where.link = {
      [Op.eq]: link,
    };
  }
  return query;
};

const getPhotos = async (params: PhotoParams) => {
  const query = constructQuery(params);
  try {
    return await PhotoModel.findAll(query);
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const editPhotos = async (photo: Partial<IPhoto>, params: PhotoParams) => {
  const query = constructQuery(params);
  // TODO: AWS editing function
  return (await PhotoModel.update(photo, { ...query, returning: true }))[1];
};

const deletePhotos = async (params: PhotoParams) => {
  const query = constructQuery(params);
  try {
    // Delete the photo from the S3 database
    deleteS3(params);
    // and remove the link from the Postgres database
    return await PhotoModel.destroy(query);
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const createPhoto = async (file: IPhotoInput, fileName: string) => {
  // Register the photo in the AWS S3 database
  try {
    if (!file?.buffer) {
      throw new Error('An uploaded image has no buffer!');
    }
    const resizedPhoto = await resizeImage(Buffer.from(file.buffer, 'base64'));
    const fullUrl = await uploadImage(resizedPhoto.full);
    // const thumbUrl = await uploadImage(resizedPhoto.thumb);
    // delete file.buffer, file.id;
    return await PhotoModel.create({
      id: uuidv4(),
      fullUrl,
    });
    
    /*
    const signatureS3: PhotoS3Signature = await signS3(file, fileName);
    const base64 = Buffer.from(file.buffer, 'base64');
    await axios.put(signatureS3.signedRequest, base64, { headers: { 'content-type': 'image/jpeg', 'x-amz-acl': 'public-read' } });
    */
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const photoService = {
  signS3,
  deleteS3,
  getPhotos,
  editPhotos,
  deletePhotos,
  createPhoto,
};

export default photoService;