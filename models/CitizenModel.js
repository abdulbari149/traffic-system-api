const { Schema, model, Types } = require("mongoose");

const CitizenSchema = new Schema({
  first_name: String,
  last_name: String,
  cnic_no: {
    type: String,
    unique: true,
  },
  phone_number: String,
  email: String,
  password: String,
  images: [{
    type: Types.ObjectId,
    ref: "Image",
  }]
}, {
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
});

CitizenSchema.virtual("name").get(function () {
  return this.first_name + " " +  this.last_name;
});
CitizenSchema.virtual("challans", {
  ref: "Challan",
  localField: "_id",
  foreignField: "citizen",
});

const Citizen = model("Citizen", CitizenSchema);
module.exports = Citizen;
