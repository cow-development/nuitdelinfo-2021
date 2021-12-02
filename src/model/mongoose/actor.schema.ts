import { Schema } from "mongoose";
import { Helper } from "../../helper.utils";

const actorSchema = new Schema({
  firstname: {
    type: String,
    set: Helper.normalizeFirstname
  },
  lastname: {
    type: String,
    uppercase: true
  },
  birthdate: Date
}, {
  _id: false
});

export default actorSchema;