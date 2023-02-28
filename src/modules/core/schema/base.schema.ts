import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BaseDocument = Base & Document;

@Schema({
  toJSON: {
    virtuals: true,
    transform: function (doc: any, ret: any) {
      delete doc._id;
      delete doc.__v;
      doc['id'] = doc._id;
      return doc;
    },
  },
  timestamps: true,
})
export class Base extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    default: Types.ObjectId,
  })
  _id: Types.ObjectId;
  @Prop({
    default: new Date(),
    type: Date,
  })
  createdAt: Date;

  @Prop({
    default: new Date(),
    type: Date,
  })
  updatedAt: Date;
}
