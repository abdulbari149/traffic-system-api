const { Schema, model, Types } = require("mongoose");

const WardenSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    phone_number: String,
    service_id: String,
    email: String,
    password: String,
    designation: {
      type: String,
      enum: ["SSP", "DSP", "SHO", "Inspector", "Sub-Inspector"]
    },
    traffic_sector: String,
    authorized: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      required: true,
      default: "onhold",
      enum: ["approve", "decline", "uncheck", "onhold"]
    },
    images: [
      {
        type: Types.ObjectId,
        ref: "Image"
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

WardenSchema.virtual("challans", {
  ref: "Challan",
  localField: "_id",
  foreignField: "warden"
});

WardenSchema.statics.findAndModify = async function (
  query,
  select = null,
  update,
  opts,
  cb
) {
  const data = await this.find(query, select, opts);
  console.log({ data })
  if(data.length === 0){
    return data
  }
  const updatePromise = data.map(async item => {
    Object.keys(update).map(u => {
      item[u] = update[u]
    })
    return item.save()
  })
  const response = Promise.all(updatePromise)
  return response
};

const Warden = model("Warden", WardenSchema);

module.exports = Warden;
