import { Schema, Types } from "mongoose";
import { Helper } from "../../../helper.utils";
import actorSchema from "../actor.schema";

const authorSchema = new Schema({
  _id: Types.ObjectId,
  firstname: {
    type: String,
    set: Helper.normalizeFirstname
  },
  lastname: {
    type: String,
    uppercase: true
  }
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