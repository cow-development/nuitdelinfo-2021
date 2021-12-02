import { Schema } from "mongoose";
import actorSchema from "../actor.schema";

const rescueSchema = new Schema({
  author: actorSchema,
  rescueDate: Date,
  rescued: [actorSchema],
  rescuers: [actorSchema],
  unrescued: [actorSchema]
});

export default rescueSchema;