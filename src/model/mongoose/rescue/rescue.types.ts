import { Actor } from '../actor.types';
import {
  Document,
  Model
} from 'mongoose';

export interface RescueDocument extends Rescue, Document {}

export interface RescueModel extends Model<RescueDocument> {}

export interface Rescue {
  author: Author;
  rescueDate: Date;
  rescued: Rescued[];
  rescuers: Rescuer[];
  unrescued: Unrescued[];
}

export type Author = {
  _id: ObjectId;
  firstname: string;
  lastname: string;
};

export interface Rescued extends Actor {}

export interface Rescuer extends Actor {}

export interface Unrescued extends Actor {}