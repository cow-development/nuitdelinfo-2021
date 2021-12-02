import { Actor } from '../../mongoose/actor.types';
import {
  Rescued,
  Rescuer,
  Unrescued
} from '../../mongoose/rescue/rescue.types';

export interface CreateRescue {
  author: Actor;
  rescueDate: string;
  rescued?: Rescued[];
  rescuers: Rescuer[];
  unrescued?: Unrescued[];
}
