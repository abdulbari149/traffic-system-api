// Id
// 	Type
// 	Type of Vehicle
// 	Registration number
// 	Vehicle Identification Number VIN
// 	Registration date
// 	Owner name
// 	Owner CNIC
// 	Engine number
// 	Chassis Number
// 	Color
// 	Horse power
// 	Seating capacity
// 	Company
// 	Vehicle Model
// 	Body type
// 	Model year

const { Schema, model } = require("mongoose")

const VechileSchema = new Schema({
    vechile: {
        type_v: String,
        id_v: {
            type: String,
            alias: "vin",
        },
        category: {
            type: String,
        },
        model: String,
        model_year: String,
        body: String,
    },
    reg: {
        no: {
            type: String,
            index: true
        },
        data: Date
    },
    owner_cnic: {
        type: String,
        index: true
    },
    engine_no: Number,
    chasis_no: Number,
    color: String,
    horse_power: Number,
    seating_capacity: Number,
    company: String,
})

const Vechile = model("vechile", VechileSchema)
module.exports = Vechile