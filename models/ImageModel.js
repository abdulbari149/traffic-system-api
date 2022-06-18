const { Schema, model, Types } = require("mongoose");
const collection = `images.files`;
const ImageSchema = new Schema(
  {
    length: { type: Number },
    chunkSize: { type: Number },
    uploadDate: { type: Date },
    filename: { type: String, trim: true, searchable: true },
    md5: { type: String, trim: true, searchable: true },
    metadata: {
      imageType: {
        type: String,
        enum: ["idCardFront", "idCardBack", "profilePic"],
      }
    },
  },
  { collection }
);

const Image = model("Image", ImageSchema, collection);

module.exports = Image;
