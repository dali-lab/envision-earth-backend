/* eslint-disable @typescript-eslint/naming-convention */
import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { IPhoto } from 'db/models/photo';
import { CreatePhotoRequest, UpdatePhotoRequest } from 'validation/photo';
import photoService from 'services/photo_service';
import { BaseError } from 'errors';
import { getSuccessfulDeletionMessage } from '../constants';

// Use the functions from the service to create photos and such
// More relating to the web service and the server than the database
const createPhoto: RequestHandler = async (req: ValidatedRequest<CreatePhotoRequest>, res, next) => {
  try {
    // Only accepts the uploaded image file
    const {
      file,
    } = req.body;

    const newPhoto = await photoService.createPhoto(
      { fileName: file.name, fileType: file.type },
      file,
    );

    res.status(201).json(newPhoto);
  } catch (error) {
    next(error);
  }
};

const getPhoto: RequestHandler = async (req, res, next) => {
  try {
    const photos: IPhoto[] = await photoService.getPhotos({
      fileName: req.params.name,
      fileType: req.params.type,
      link: req.params.url,
    });

    if (photos.length === 0) throw new BaseError('Photo not found', 404);
    else res.status(200).json(photos[0]);
  } catch (error) {
    next(error);
  }
};

// Updating photos is kind of busted right now
// TODO: make it not busted
const updatePhoto: RequestHandler = async (_req: ValidatedRequest<UpdatePhotoRequest>, _res, next) => {
  try {
    // const { link, file } = req.body

    // const updatedPhotos = await photoService.editPhotos(
    //   { fullUrl: link },
    //   { fileName: file.name, fileType: file.type, link },
    // )

  } catch (error) {
    next(error);
  }
};

const deletePhoto: RequestHandler = async (req, res, next) => {
  try {
    const photos: IPhoto[] = await photoService.getPhotos({
      fileName: req.params.name,
      fileType: req.params.type,
      link: req.params.url,
    });
    if (photos.length === 0) throw new BaseError('Photo not found', 404);
    else {
      await photoService.deletePhotos({
        fileName: req.params.name,
        fileType: req.params.type,
        link: req.params.url,
      });
      res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
    }
  } catch (error) {
    next(error);
  }
};

const photoController = {
  createPhoto,
  getPhoto,
  updatePhoto,
  deletePhoto,
};

export default photoController;
