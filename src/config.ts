import { Request, Response, NextFunction } from 'express';
import { UserEntry } from './interfaces/users_interfaces';

const joi = require('joi');
require('dotenv').config();

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || ""

export const withErrorHandler =
  (cb: (req: Request, res: Response) => void) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.path, req.body);
    try {
      await cb(req, res);
    } catch (e) {
      next(e);
    }
  };

  
export const MEMORY_DB: Record<string, UserEntry> = {};

const validUserTypes = ['user', 'admin'];

export const userValidationSchema = joi.object({
  username: joi.string()
    .alphanum()
    .min(3)
    .max(24)
    .required(),
  email: joi.string()
    .email()
    .lowercase()
    .required(),
  type: joi.any()
    .valid(...validUserTypes),
  password: joi.string()
    .pattern(new RegExp('^(?=.{3,24})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=-_)(]).*$')),
})
