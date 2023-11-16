import mongoose from 'mongoose';

interface Attr {
  original_url: string;
  short_url: string;
}

interface UrlDoc extends mongoose.Document {
  original_url: string;
  short_url: string;
}

interface UrlModel extends mongoose.Model<UrlDoc> {
  build(attrs: Attr): UrlDoc;
}

const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: String, unique: true },
});

urlSchema.statics.build = (attrs: Attr) => {
  return new Url(attrs);
};

const Url = mongoose.model<UrlDoc, UrlModel>('Url', urlSchema);

export { Url };
