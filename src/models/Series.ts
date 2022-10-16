import { Schema, model, PaginateModel, Document } from "mongoose";
import paginate from "mongoose-paginate-v2";

interface ISeries extends Document {
  uid: string;
  series: {
    _id: Schema.Types.ObjectId;
    title: string;
    gender: string;
    rate: number;
    img64: string;
    description: string;
    createdAt: Number;
  };
}

interface ISeriesDocument extends Document, ISeries {}

const SeriesSchema = new Schema<ISeries>({
  uid: {
    type: String,
    required: true,
  },
  series: {
    _id: {
      type: Schema.Types.ObjectId,
      index: true,
      auto: true,
    },
    title: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
});

SeriesSchema.plugin(paginate);

// interface SeriesModel<T extends Document> extends PaginateModel<T> {}

// export const SeriesModel: SeriesModel<ISeries> = model<ISeries>('ISeries', SeriesSchema) as SeriesModel<ISeries>;

export const Series = model<ISeriesDocument, PaginateModel<ISeriesDocument>>(
  "Series",
  SeriesSchema
);
