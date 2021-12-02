import { Request } from 'express';
import { User } from './mongoose/user/user.types';

export interface SignedRequest extends Request {
  author: Partial<User> & { _id: string };
}