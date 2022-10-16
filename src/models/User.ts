import { Schema, model } from "mongoose";

interface IUser {
  // name: string;
  uid: string;
  email: string;
  password: string;
  confirm_password: string;
  token: string;
}

const userSchema = new Schema<IUser>({
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    min: 8,
    max: 20,
    required: true,
  },
  token: {
    type: String,
    default: "",
  },
});

export const User = model("User", userSchema);
