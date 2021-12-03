import {
  Document,
  Model
} from 'mongoose';

export interface UserDocument extends User, Document {
  validPassword(password: string): boolean;

  generateJWT(): string;
}

export interface UserModel extends Model<UserDocument> {
  findByName(this: Model<UserDocument, {}>, username: string): Promise<UserDocument>;
}

export interface User {
  username: string;
  signUpDate: Date;
  password: {
    hash: string;
    salt: string;
  };
  personalData?: {
    firstname?: string;
    lastname?: string;
    birthdate?: Date;
  };
  isAdmin?: boolean;
}