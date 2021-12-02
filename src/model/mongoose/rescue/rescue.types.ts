import { Actor } from '../actor.types';
import {
  Document,
  Model
} from 'mongoose';

export interface RescueDocument extends Rescue, Document {}

export interface RescueModel extends Model<RescueDocument> {}

export interface Rescue {
  rescueDate: Date;
  rescued: Rescued[];
  rescuers: Rescuer[];
}

export interface Rescued extends Actor {}

export interface Rescuer extends Actor {}

export interface Unrescued extends Actor {}