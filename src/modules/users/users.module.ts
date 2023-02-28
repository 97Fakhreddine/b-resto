import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from '../core/constants/constants';
import { IsAuthenticated } from '../core/middlewares/IsAuthenticated';
import { UsersAuthController } from './controllers/users.controller';
import { User, UserSchema } from './models/users.schema';
import { UserService } from './services/users.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register(jwtConstants),
  ],
  controllers: [UsersAuthController],
  providers: [UserService, IsAuthenticated],
  exports: [UserService, IsAuthenticated],
})
export class UserModule {}
