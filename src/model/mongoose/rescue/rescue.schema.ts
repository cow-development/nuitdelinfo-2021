import { Schema, Types } from "mongoose";
import actorSchema from "../actor.schema";

const authorSchema = new Schema({
  _id: Types.ObjectId,
  firstname: String,
  lastname: String
})

const rescueSchema = new Schema({
  author: authorSchema,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  rescueDate: Date,
  rescued: [actorSchema],
  rescuers: [actorSchema],
  unrescued: [actorSchema],
  isConfirmed: {
    type: Boolean,
    default: false
  }
});

export default rescueSchema;