/* eslint-disable @typescript-eslint/naming-convention */
import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
// import Photo, { IPhoto } from 'db/models/photo';
import { CreatePhotoRequest, UpdatePhotoRequest } from 'validation/photo';
// import photoService from 'services/photo_service';

// Use the functions from the service to create photos and such
// More relating to the web service and the server than the database
const createNewPhoto: RequestHandler = async (req: ValidatedRequest<CreatePhotoRequest>, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getPhoto: RequestHandler = async (req, res, next) => {
  try {

  } catch (error) {
    next(error);
  }
};

const updatePhoto: RequestHandler = async (req: ValidatedRequest<UpdatePhotoRequest>, res, next) => {
  try {

  } catch (error) {
    next(error);
  }
};

const deletePhoto: RequestHandler = async (req, res, next) => {
  try {

  } catch (error) {
    next(error);
  }
};

const photoController = {
  createNewPhoto,
  getPhoto,
  updatePhoto,
  deletePhoto,
};

export default photoController;
