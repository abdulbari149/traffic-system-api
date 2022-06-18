const { Schema, model } = require("mongoose");

const VoilationSchema = new Schema({
  code: String,
  voilation: String,
  v_type: {
    type:String,
    enum: ["moving", "parking"]
  },
  price: Number,
});

const Voilation = model("Voilation", VoilationSchema);

module.exports = Voilation;
