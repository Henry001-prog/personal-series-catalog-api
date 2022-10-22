import { Schema, model, PaginateModel, Document } from "mongoose";

interface ImageTypes extends Document {
  file: Buffer;
  uid: string;
  name: string;
  size: number;
  key: string;
  url: string;
  path: string;
  createdAt: Number;
}

const imageSchema = new Schema<ImageTypes>({
  // uid: String,
  name: String,
  size: Number,
  key: String,
  url: String,
  path: String,
  file: {
    data: Buffer,
    contentType: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Image = model("Image", imageSchema);
