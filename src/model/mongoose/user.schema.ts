import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findByName } from './user.statics';
import { Schema } from 'mongoose';
import { Helper } from '../../helper.utils';

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  firstname: {
    type: String,
    set: Helper.normalizeFirstname
  },
  lastname: {
    type: String,
    uppercase: true
  },
  birthdate: Date,
  signUpDate: Date,
  password: {
    type: {
      hash: String,
      salt: String
    }
  }
});

userSchema.statics.findByName = findByName;

userSchema.methods.validPassword = function (password: string) {
  const hash = bcrypt
    .hashSync(password, this.password.salt);
  
  return this.password.hash === hash;
};

userSchema.methods.generateJWT = function () {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  
  return jwt.sign(
    {
      _id: this._id,
      expires: Math.trunc(expires.getTime() / 1000)
    },
    process.env.JWT as string
  );
};

export default userSchema;