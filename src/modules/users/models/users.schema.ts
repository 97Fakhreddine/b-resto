import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserTypes } from '../enums/userEnum';
import * as mongoose from 'mongoose';
import { Base } from 'src/modules/core/schema/base.schema';

export type UserDocument = User & Document;

@Schema()
export class User extends Base {
  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  name: string;

  @Prop({
    index: true,
    lowercase: true,
    required: true,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
  })
  token: string;

  @Prop({
    type: String,
  })
  password: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  useTwoFactorAuth: boolean;

  @Prop([{ type: mongoose.Schema.Types.Mixed }])
  google: any;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
  })
  googleAccess: any;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
  })
  googleCalendarOptions: any;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: String,
  })
  location: string;

  @Prop({
    default: 'assets/images/avatars/brian-hughes.jpg',
    type: String,
  })
  avatar: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isEmailVerified: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isPhoneVerified: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isSuspend: boolean;

  @Prop({
    default: false,
    type: Boolean,
  })
  isRevoked: boolean;

  @Prop({
    default: false,
    type: Boolean,
  })
  deleted: boolean;

  @Prop({
    type: String,
    default: UserTypes.CLIENT,
    enum: [
      UserTypes.ADMIN,
      UserTypes.SUPER,
      UserTypes.CLIENT,
      UserTypes.RESTORANT,
    ],
  })
  type: UserTypes;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function (this: UserDocument) {
  return this._id;
});

export { UserSchema };
