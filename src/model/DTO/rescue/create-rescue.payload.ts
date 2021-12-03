import {
  Author,
  GeographicPoint,
  Rescued,
  Rescuer,
  Unrescued
} from '../../mongoose/rescue/rescue.types';

export interface CreateRescuePayload {
  author: Omit<Author, '_id'>;
  location: GeographicPoint;
  rescueDate: Date;
  rescued?: Rescued[];
  rescuers: Rescuer[];
  unrescued?: Unrescued[];
}