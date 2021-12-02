import { Schema } from "mongoose";
import actorSchema from "../actor.schema";

const rescuedSchema = new Schema({
  personalData: actorSchema
});

const rescuerSchema = new Schema({
  personalData: actorSchema
});

const rescueSchema = new Schema({
  rescueDate: Date,
  rescued: [rescuedSchema],
  rescuers: [rescuerSchema]
});

export default rescueSchema;