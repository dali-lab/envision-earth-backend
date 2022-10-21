// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import PhotoModel from 'db/models/photo';
import dotenv from 'dotenv';
import { DatabaseQuery } from '../constants';
import { Op } from 'sequelize';
import { BaseError } from 'errors';
import { resizeImage, uploadImage, deleteImage } from '../util';

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

export interface PhotoS3Signature {
  signedRequest: string,
  url: string
}

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

const deletePhotos = async (params: PhotoParams) => {
  const query = constructQuery(params);
  try {
    // Delete the photo from the S3 database
    const key = params.link.replace('https://', '').replace(process.env.S3_BUCKET_NAME as string, '').replace('.s3.amazonaws.com/', '');
    deleteImage({ key });
    // and remove the link from the Postgres database
    return await PhotoModel.destroy(query);
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const createPhoto = async (file: IPhotoInput) => {
  // Register the photo in the AWS S3 database
  try {
    if (!file?.buffer) {
      throw new Error('An uploaded image has no buffer!');
    }
    const resizedPhoto = await resizeImage(Buffer.from(file.buffer, 'base64'));
    const fullUrl = await uploadImage(resizedPhoto.full);
    // const thumbUrl = await uploadImage(resizedPhoto.thumb);

    return await PhotoModel.create({
      id: uuidv4(),
      fullUrl,
    });
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const photoService = {
  getPhotos,
  deletePhotos,
  createPhoto,
};

export default photoService;