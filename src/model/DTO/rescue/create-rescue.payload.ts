import {
  Author,
  Rescued,
  Rescuer,
  Unrescued
} from '../../mongoose/rescue/rescue.types';

export interface CreateRescuePayload {
  author: Author;
  rescueDate: Date;
  rescued?: Rescued[];
  rescuers: Rescuer[];
  unrescued?: Unrescued[];
}