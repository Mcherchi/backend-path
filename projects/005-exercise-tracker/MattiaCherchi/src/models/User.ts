import mongoose from 'mongoose';

interface Attrs {
  username: string;
}

interface UserDoc extends mongoose.Document {
  username: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: Attrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: Attrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
