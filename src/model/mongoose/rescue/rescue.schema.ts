import { Schema, Types } from "mongoose";
import actorSchema from "../actor.schema";

const authorSchema = new Schema({
  _id: Types.ObjectId,
  firstname: String,
  lastname: String
})

const rescueSchema = new Schema({
  author: authorSchema,
  rescueDate: Date,
  rescued: [actorSchema],
  rescuers: [actorSchema],
  unrescued: [actorSchema]
});

export default rescueSchema;