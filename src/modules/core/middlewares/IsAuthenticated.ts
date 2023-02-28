import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/modules/users/services/users.service';
import { jwtConstants } from '../constants/constants';
@Injectable()
export class IsAuthenticated implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: Request | any, res: Response, next: NextFunction) {
    try {
      if (
        req.headers.authorization ||
        (req.query && req.query.authorizationtoken)
      ) {
        const token =
          req.headers.authorization.split(' ')[1] ||
          req.query.authorizationtoken.toString().split(' ')[1];
        const access_token = this.userService.jwtService.verify(
          token,
          jwtConstants,
        );
        const user = await this.userService.userModel.findOne({
          email: access_token.email,
        });
        if (!user) {
          throw new UnauthorizedException('You are not authenticated');
        }
        req.user = user;
        next();
      } else {
        throw new UnauthorizedException('You are not authenticated');
      }
    } catch (e) {
      next(e);
    }
  }
}
