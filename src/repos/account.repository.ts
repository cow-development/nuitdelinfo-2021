import bcrypt from 'bcrypt';
import { CreateUserPayload } from '../model/DTO/create-user.payload';
import { AppError } from '../model/error.model';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { User, Userdocument, UserModel } from '../model/mongoose/user/user.types';
import { MonitoringService } from '../services/monitoring.service';

export class UserRepository implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  get monitor() {
    return this._monitor;
  }

  constructor(private _model: UserModel) {
    this._monitor.log(LogType.passed, 'Initialized user repository');
  }

  /**
   * Find a user by its name.
   * @param name Given name.
   * @param strict Sets whether an error is thrown when no user is found.
   * @returns Either an IUserDocument or (maybe) null if strict mode is set to false.
   */
  async findByName(name: string, strict?: true): Promise<Userdocument> ;
  async findByName(name: string, strict: false): Promise<Userdocument | null> ;
  async findByName(name: string, strict: boolean = true) {
    const result = await this._model.findByName(name.toLowerCase()) || await this._model.findByName(name);
    if (!result && strict) {
      throw new AppError(404, `User with name '${name}' couldn't be found.`);
    }

    return result;
  }

  /**
   * Create and save a new user in database.
   * @param payload @see CreateUserPayload
   */
  async create(payload: CreateUserPayload) {
    if (await this.findByName(payload.username, false)) {
      throw new AppError(409, 'User already exists.');
    }

    const user: User = {
      username: payload.username,
      signUpDate: new Date(),
      password: {
        hash: '',
        salt: ''
      }
    };

    // generate both salt and hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(payload.password, salt);

    user.password = {
      hash,
      salt
    };

    const created = await this._model.create(user);
    
    const {
      password: hidden,
      ...returned
    } = created.toJSON();

    return {
      token: created.generateJWT(),
      ...returned
    };
  }
}