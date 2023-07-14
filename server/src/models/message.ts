import { Schema, Model, model, HydratedDocument } from "mongoose";
import { User } from "./user";

export interface MessageAttrs {
  id?: string;
  sender: typeof Schema.Types.ObjectId;
  receiver: typeof Schema.Types.ObjectId;
  type: "audio" | "image" | "text";
  message: string;
  messageStatus: "sent" | "delivered" | "seen";
  createdAt?: Date;
}

interface MessageModel extends Model<MessageAttrs> {
  build(attrs: MessageAttrs): HydratedDocument<MessageAttrs>;
}

export const messageSchema = new Schema<MessageAttrs, MessageModel>(
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
        delete ret.__v;
      },
    },
  }
);

// messageSchema.post("save", async function (doc) {
//   const sender = await User.findById(doc.sender);
//   const receiver = await User.findById(doc.receiver);
//   if (sender && receiver) {
//     console.log(sender.sentMessages);
//     console.log(receiver.receivedMessages);
//     console.log(doc);
//     console.log("end");

//     sender.sentMessages?.push(doc);
//     receiver.receivedMessages?.push(doc);
//     await sender.save();
//     await receiver.save();
//   }
// });

messageSchema.statics.build = (attrs: MessageAttrs) => {
  return new Message<MessageAttrs>(attrs);
};

export const Message = model<MessageAttrs, MessageModel>(
  "Message",
  messageSchema
);

// export { Message };
