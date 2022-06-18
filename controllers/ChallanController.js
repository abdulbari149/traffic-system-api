const { Challan, Warden, Citizen } = require("../models");
const { Types } = require("mongoose");
class ChallanController {
  response = {
    data: null,
    message: "",
    status: 0,
  };
  submitChallan = async (req, res) => {
    try {
      const { id: warden } = res.locals.data;
      const data = await Challan.create({
        ...req.body,
        warden,
      });
      this.response = {
        message: "Your challan has been successfully submitted",
        status: 200,
        data,
      };
    } catch (error) {
      this.response = {
        message: error.message,
        status: 404,
      };
    }
    res.status(this.response.status).json(this.response);
  };
  getChallans = async (req, res) => {
    try {
      const { email, id } = res.locals.data;
      const { DbModel } = res.locals;
      const data = await DbModel.findById(id).populate({
        path: "challans",
        populate: {
          path: "voilation",
          model: "Voilation",
        },
      });
      this.response = {
        data: data.challans.map((challan) => ({
          ...challan._doc,
        })),
        message: "These are the registered challans",
        status: 200,
      };
    } catch (error) {
      this.response = {
        message: error.message,
        status: 404,
      };
    }
    res.status(this.response.status).json(this.response);
  };

  getChallanRecords = async (req, res) => {
    try {
      const { paid } = req.query;

      let properties =
        req.params.user === "warden"
          ? "citizen vehicle_registration_no createdAt"
          : "psid_no vehicle_registration_no createdAt fine_imposed paid";

      const records = await Challan.find(
        {
          [req.params.user]: res.locals.data.id,
          ...(typeof paid !== "undefined" && { paid: Boolean(parseInt(paid)) }),
        },
        properties
      )
        .sort({ createdAt: -1 })
        .populate("citizen");

      const transformedData = records.map((doc) => ({
        ...doc._doc,
        citizen: undefined,
        name: req.params.user === "warden" ? doc._doc.citizen.name : undefined,
      }));

      this.response = {
        data: transformedData,
        status: 200,
      };
    } catch (error) {
      this.response = {
        error,
        message: "BAD_REQUEST",
        status: 400,
      };
    }
    res.status(this.response.status).json(this.response);
  };

  getChallanById = async (req, res) => {
    try {
      const id = req.params.challan_id;

      const data = await Challan.findById(id)
        .populate({
          path: "citizen",
          select: "first_name last_name images cnic_no",
          populate: { path: "images", model: "Image", select: "filename" },
        })
        .populate("voilation")
        .lean();
      this.response = {
        data,
        status: 200,
      };
    } catch (error) {
      this.response = {
        error,
        message: "An Error Occured",
        status: 400,
      };
    }
    res.status(this.response.status).json(this.response);
  };

  getChallanCount = async (req, res) => {
    try {
      const { data, monthlyDate, yearlyDate } = res.locals;

      const monthlyCount = await Challan.find({
        warden: data.id,
        createdAt: { $gte: monthlyDate },
      }).count();
      const yearlyCount = await Challan.find({
        warden: data.id,
        createAt: { $gte: yearlyDate },
      }).count();
      res.status(200).json({ monthlyCount, yearlyCount });
    } catch (error) {}
  };
}

module.exports = new ChallanController();
