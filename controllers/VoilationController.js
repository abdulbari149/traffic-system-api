const { Voilation } = require("../models");

class VoilationController {
  response = {
    data: null,
    message: "",
    status: 0,
  };

  addVoilation = async (req, res) => {
    try {
      const newVoilation = new Voilation({
        voilation: req.body.voilation,
        v_type: req.body.v_type,
        code: req.body.code,
        price: req.body.price,
      });
      const data = await newVoilation.save();
      if (!data) {
        throw new Error("Voilation hasn't been added");
      } else {
        this.response = {
          data,
          message: "Voilation has been successfully added",
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

  getVoilations = async (req, res) => {
    try {
      const query =
        typeof req.query.v_type !== "undefined"
          ? { v_type: req.query?.v_type }
          : {};
      const voilations = await Voilation.find(query);
      this.response = {
        data: voilations,
        message: "Succees",
        status: 200,
      };
    } catch (error) {
      this.response = {
        message: error.message,
        status: 404,
      };
    } finally {
      res.status(this.response.status).json(this.response);
    }
  };

  updateVoiationPrice = async (req, res) => {
    try {
      const { new_price, id } = req.body;
      const voilation = await Voilation.findByIdAndUpdate(id, {
        price: new_price,
      });

      this.response = {
        message: "Price has been updated Successfully",
        status: 200,
        data: voilation,
      };
    } catch (error) {
      this.response = {
        message: error,
        status: 404,
      };
    } finally {
      res.status(this.response.status).json(this.response);
    }
  };
}

module.exports = new VoilationController();
