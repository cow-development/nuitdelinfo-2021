import {
  Document,
  Model
} from 'mongoose';

/**
 * Represents a standard User Document from database.
 * Includes both IUser and Document own fields.
 */
export interface Userdocument extends User, Document {
  /**
   * Check whether the given password matches the user's password.
   * @param password Given password.
   */
  validPassword(password: string): boolean;

  /**
   * Generate a signed JSON Web Token.
   */
  generateJWT(): string;
}

/**
 * Represents a standard User mongoose model.
 * Contains documents of type IUserDocument.
 */
export interface UserModel extends Model<Userdocument> {
  /**
   * Find a user by its name.
   * @param this User model.
   * @param name Name to look for.
   */
  findByName(this: Model<Userdocument, {}>, username: string): Promise<Userdocument>;
}

/**
 * The representation of a user.
 */
export interface User {
  /** User's displayed nickname. */
  username: string;

  /** User's firstname. */
  firstname?: string;

  /** User's lastname. */
  lastname?: string;

  /** User's birthdate. */
  birthdate?: Date;

  /** User's sign up date. */
  signUpDate: Date;

  /** User's password details. */
  password: {
    hash: string;
    salt: string;
  };
}