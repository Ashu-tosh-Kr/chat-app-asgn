import { Schema, Model, model, HydratedDocument } from "mongoose";
import { Password } from "../helpers/password";

interface UserAttrs {
  username: string;
  email: string;
  password: string;
}

interface UserModel extends Model<UserAttrs> {
  build(attrs: UserAttrs): HydratedDocument<UserAttrs>;
}

const userSchema = new Schema<UserAttrs, UserModel>(
  {
    username: {
      type: String,
    },
    email: {
      type: String,

      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
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

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User<UserAttrs>(attrs);
};

const User = model<UserAttrs, UserModel>("User", userSchema);

export { User };
