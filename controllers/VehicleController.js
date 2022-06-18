const Vechile = require("../models/VehicleModel")

class VechileController {
    response = {
        data: null,
        message: "",
        status: 0
    }

    getVechilesByCitizenCnic = async (req, res) => {
        const { cnic, citizenId } = req.body
        try {
            const vehicleDocs = await Vechile.find({ owner_cnic })

            if (!vechileDoc) {
                throw new Error("The Vechile with the CNIC doesn't exist")
            }

            this.response.data = vehicleDocs
            this.response.message = "Vechiles Exist"
            this.response.status = 200


        } catch (error) {

            this.response.message = error.message
            this.response.status = 404
        }

        res.status(this.response.status).json(this.response)
    }

    getVechileByRegNo = async (req, res) => {
        const { reg_no } = req.body

        try {
            const vehicleDoc = await Vechile.find({ reg: { no: reg_no } }, ['vehicle', 'owner_cnic', 'reg', 'engine_no', 'chasis_no'])

            if (!vehicleDoc) {
                throw new Error("The provided registration Number is invalid")
            }
            this.response.data = vechileDoc
            this.response.message = "A vehicle with the specified Registration Number exists"
            this.response.status = 200

        } catch (error) {
            this.response.message = error.message
            this.response.status = 404
        }

        res.json(this.response).status(this.response.status)

    }

    addNewVehicle = async (req, res) => {
        const { cnic, id } = res.locals.data
        const { data } = req.body
        let result = null
        try {
            const newVehicle = new Vehicle({
                ...data,
                owner_cnic: cnic
            })
            result = await newVehicle.save()
            this.response.data = result
            this.response.message = "Succesfully added Your vehicle"
            this.response.status = 200

        } catch (error) {

        }
        res.json(this.response).status(this.response.status)
    }


    updateVehicleByRegNo = async (req, res) => {
        const { reg_no } = req.params
        const { vehicleData } = req.body
        try {
            // Finding whether the particular vehicle exits and updating it
            const vehicleDoc = await Vehicle.findOneAndUpdate({ reg_no }, { $set: { ...vehicleData } }, {
                new: true
            })

            this.response.data = vehicleDoc
            this.response.message = "Vehicle was updated successfully"
            this.response.status = 200

        } catch (error) {
            this.response.data = null
            this.response.message = error.message
            this.response.status = 404
        }

        res.status(this.response.status).json(this.response)
    }

    deleteVehicleByRegNo = async (req, res) => {
        const { reg_no } = req.params
        try {
            const deletedVehicleDoc = await Vehicle.findOneAndRemove({ reg_no })
            this.response.message = "Vehicle was deleted successfully"
            this.response.status = 200
        } catch (error) {
            this.response.message = error.message
            this.response.status = 404
        }
        res.status(this.response.status).json(this.response)
    }

}

module.exports = new VechileController()