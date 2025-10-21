import { model, Schema } from "mongoose";
import { IUser } from "../../../../../../shared/dist/types/index.js";

const UserMongoSchema = new Schema<IUser>(
  {
    uuid: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profile: {
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      friends: [{ type: String }],
    },
    settings: {
      isVerified: { type: Boolean, default: false },
      isActive: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const UserModel = model("Users", UserMongoSchema);
