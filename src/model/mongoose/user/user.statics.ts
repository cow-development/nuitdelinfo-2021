import { UserDocument } from './user.types';
import { Model } from 'mongoose';

export async function findByName(this: Model<UserDocument, {}>, username: string) {
  return await this.findOne({ username });
}