const { Citizen } = require("../models");

class CitizenController {
  response = {
    data: null,
    message: "",
    status: 0,
  };

  getCitizenByCNIC = async (req, res) => {
    try {
      const doc = await Citizen.findOne({ cnic_no: req.query.cnic });
      if (!doc) {
        this.response = {
          status: 404,
          message: "Driver Not Found",
        };
      } else {
        this.response = {
          data: {
            name: `${doc.first_name} ${doc.last_name}`,
            id: doc._id,
            cnic: doc.cnic_no,
          },
          message: "Driver Found",
          status: 200,
        };
      }
    } catch (error) {
      this.response = {
        status: 400,
        message: error.message,
      };
    }
    res.status(this.response.status).json(this.response);
  };
}

module.exports = new CitizenController();
