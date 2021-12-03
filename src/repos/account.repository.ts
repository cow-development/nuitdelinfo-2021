import { AppError } from '../model/error.model';
import { AuthenticatePayload } from '../model/DTO/account/authenticate.payload';
import bcrypt from 'bcrypt';
import { CreateUserPayload } from '../model/DTO/account/create-user.payload';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { MonitoringService } from '../services/monitoring.service';
import {
  User,
  UserDocument,
  UserModel
} from '../model/mongoose/user/user.types';

export class AccountRepository implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  get monitor() {
    return this._monitor;
  }

  constructor(private _model: UserModel) {
    this._monitor.log(LogType.passed, 'Initialized account repository');
  }

  async authenticate(payload: AuthenticatePayload) {
    const user = await this.findByName(payload.username);
    
    const hash = await bcrypt
      .hash(
        payload.password,
        user.password.salt
      );
    if (hash !== user.password.hash)
      throw new AppError(401, 'Incorrect username or password.');
    
    const {
      password: hidden,
      ...returned
    } = user.toJSON();

    return {
      ...returned,
      token: user.generateJWT()
    };
  }
  
  async findByName(name: string, strict?: true): Promise<UserDocument> ;
  async findByName(name: string, strict: false): Promise<UserDocument | null> ;
  async findByName(name: string, strict: boolean = true) {
    const result = await this._model.findByName(name.toLowerCase()) || await this._model.findByName(name);
    if (!result && strict) {
      throw new AppError(404, `User with name '${name}' couldn't be found.`);
    }

    return result;
  }

  async findById(userId: string) {
    const user = await this._model.findById(userId);
    if (!user) {
      throw new AppError(404, 'User does not exist.');
    }
    return user;
  }

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