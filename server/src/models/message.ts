import { Schema, Model, model, HydratedDocument } from "mongoose";

export interface MessageAttrs {
  sender: typeof Schema.Types.ObjectId;
  receiver: typeof Schema.Types.ObjectId;
  type: "audio" | "image" | "text";
  message: string;
  messageStatus: "sent" | "delivered" | "seen";
}

interface MessageModel extends Model<MessageAttrs> {
  build(attrs: MessageAttrs): HydratedDocument<MessageAttrs>;
}

const userSchema = new Schema<MessageAttrs, MessageModel>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,

      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    // toJSON allows us to change the response of the user object when we send it back to the client, this way we can convert _id to id and remove password
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: MessageAttrs) => {
  return new Message<MessageAttrs>(attrs);
};

export const Message = model<MessageAttrs, MessageModel>("Message", userSchema);

// export { Message };
