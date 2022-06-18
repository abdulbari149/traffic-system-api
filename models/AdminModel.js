const { Schema, model } = require("mongoose")


const AdminSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "admin",
    enum: ["superadmin", "admin"]
  }
}, {
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
});


const Admin = model("Admin", AdminSchema);
module.exports = Admin;