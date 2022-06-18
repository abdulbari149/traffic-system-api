const { model, Schema, Types } = require("mongoose");

const ChallanSchema = new Schema({
  citizen: {
    ref: "Citizen",
    type: Types.ObjectId,
  },
  psid_no: {
    type: String,
    immutable: true,
    unique: true,
    length: 17
  },
  place_of_voilation: String,
  district: String,
  division: String,
  province: String,
  voilation: {
    ref: "Voilation",
    type: Types.ObjectId,
  },
  vehicle_registration_no: String,
  traffic_sector: String,
  warden: {
    type: Types.ObjectId,
    ref: "Warden",
  },
  fine_imposed: Number,
  paid: {
    type: Boolean,
    default: false,
  },
}, {
   timestamps: true
});

module.exports = model("Challan", ChallanSchema);
