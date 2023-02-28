import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { jwtConstants } from 'src/modules/core/constants/constants';
import { UserTypes } from '../enums/userEnum';
import { userValidationPolicy } from '../facades/userValidationPolicy';
import { User, UserDocument } from '../models/users.schema';
import { Login, Signup } from '../types/types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) public userModel: Model<UserDocument>,
    public jwtService: JwtService,
  ) {}

  async login(body: Login) {
    try {
      const { email, password } = body;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new HttpException('Email is incorrect', HttpStatus.BAD_REQUEST);
      }
      const validator = new userValidationPolicy(user);
      const isValid = await validator.isValidPassword(password);
      if (!isValid) {
        throw new HttpException(
          'Password is incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }
      const token = this.jwtService.sign({
        email: user.email,
        secret: jwtConstants.secret,
      });
      user.token = token;
      await user.save();
      return user;
    } catch (e) {
      return e;
    }
  }

  async signup(body: Signup): Promise<object | Error> {
    try {
      const { email, name, password } = body;
      const checkExistMail = await this.userModel.findOne({
        email,
      });
      if (checkExistMail) {
        throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
      }
      const user = await this.userModel.create({
        email,
        name,
        password,
        type: UserTypes.CLIENT,
      });
      const token = this.jwtService.sign({
        email: email,
        secret: jwtConstants.secret,
      });
      user.token = token;
      const newUser = await this.userModel.create(user);
      const validator = new userValidationPolicy(newUser);
      await validator.encryptPassword();
      return await validator.returnCurrentUser();
    } catch (e) {
      return e;
    }
  }

  async getCurrentUser(authorisation: string): Promise<string | object> {
    try {
      console.info(authorisation);
      const token = authorisation.split(' ')[1];
      const access_token = this.jwtService.verify(token, jwtConstants);

      const user = await this.userModel.findOne({
        email: access_token.email,
      });
      if (user) {
        const newToken = this.jwtService.sign({
          email: user.email,
          secret: jwtConstants.secret,
        });
        user.token = newToken;
        await user.save();
        return user;
      } else {
        return new NotFoundException('YOU SHOULD SIGN IN AGAIN PLEASE! ');
      }
    } catch (e) {
      return e;
    }
  }
}
