const { Schema, model, Types } = require("mongoose");

const WardenApprovalSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      default: "uncheck",
      enum: ["approve", "decline", "uncheck"]
    },
    adminId: {
      type: Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    wardenId: {
      type: Types.ObjectId,
      ref: "Warden",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const WardenApproval = model("WardenApproval", WardenApprovalSchema);
module.exports = WardenApproval;
