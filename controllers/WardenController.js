const { Warden, WardenImage, Challan, WardenApproval } = require("../models");
const { compare, hash } = require("bcrypt");
const { sendSMS } = require("../lib/twilioSMS");
const async = require("async");
const jwt = require("jsonwebtoken");
// Authorized --> 100
// Ok --> 200
// Error --> 404
class WardenController {
  response = { message: "", status: 0, data: null };

  getWardenData = async (req, res) => {
    const { _id } = res.locals.data;
    try {
      const wardenDoc = await Warden.findById(_id);

      if (!wardenDoc) {
        throw new Error("You have passed the wrong warden id");
      }

      this.response.message = "A warden with the provided id exists";
      this.response.data = wardenDoc;
      this.response.status = 200;
    } catch (error) {
      this.response.message = error.message;
      this.response.status = 404;
    }
    res.status(this.response.status).send(this.response);
  };

  assignWardensToAdmin = async (req, res) => {
    assignBlock: try {
      const options = {
        new: true,
        limit: 10,
        populate: {
          path: "images",
          transform: (data, id) => ({
            source: `http://localhost:3000/api/image/warden/file/filename/${data?._doc?.filename}`,
            type: data?._doc?.metadata?.imageType
          })
        }
      }

      const docs = await Warden.findAndModify(
        { authorized: false, status: "onhold" },
        "-password",
        { status: "uncheck" },
        options
      );
      if (!docs) {
        this.response = {
          message:
            "There are no further account approval requests to handle. Thanks!",
          status: 404
        };
        break assignBlock;
      }

      let assignWardenToAdminData = docs.map((doc) => ({
        wardenId: doc._doc._id,
        adminId: res.locals.data.id,
        status: "uncheck"
      }));

      const wardenApprovals = await WardenApproval.insertMany(
        assignWardenToAdminData
      );

      this.response = {
        data: docs,
        status: 200
      };
    } catch (error) {
      this.response = {
        message: error,
        status: 404
      };
    }
    res.status(this.response.status).json(this.response);
  };

  getWardenListForApproval = async (req, res) => {
    wardenListBlock: try {
      const docs = await WardenApproval.find({
        adminId: res.locals.data.id,
        status: req?.query?.status ?? "uncheck"
      })
        .populate({
          path: "wardenId",
          select: "-password",
          populate: {
            path: "images",
            select: "filename metadata.imageType"
          }
        })
        .lean();
      if (docs.length === 0) {
        this.response = {
          message: "Warden's are not currently associated to this admin",
          status: 404,
          data: null
        };
        break wardenListBlock;
      }

      this.response = {
        data: docs?.map((doc) => ({
          ...doc.wardenId,
          status: doc.status,
          images: doc.wardenId.images.map((img) => ({
            source: `http://localhost:5000/api/image/warden/file/${img.filename}`,
            type: img.metadata.imageType
          }))
        })),
        status: 200,
        message: "Your Warden List is"
      };
    } catch (error) {
      this.response = {
        error,
        status: 500
      };
    }
    res.status(this.response.status).json(this.response);
  };

  getWardenDetailsById = async (req, res) => {
    try {
      const doc = await Warden.findById(req.params.id, "-password").populate(
        "images"
      );
      this.response = {
        data: {
          ...doc._doc,
          challans: undefined
        },
        status: 200
      };
    } catch (error) {
      this.response = {
        error,
        message: "An Error Occured",
        status: 404
      };
    }
    res.status(this.response.status).json(this.response);
  };

  authorizeWarden = async (req, res) => {
    authorizeBlock: try {
      const wardenApproval = await WardenApproval.findOneAndUpdate(
        { wardenId: req.body.wardenId, adminId: res.locals.data.id },
        {
          status: "approve"
        }
      );
      if (!wardenApproval) {
        this.response = {
          message: "Warden doesn't exists",
          status: 404
        };
        break authorizeBlock;
      }

      const warden = await Warden.findByIdAndUpdate(req.body.wardenId, {
        status: "approve",
        authorized: true
      });

      this.response = {
        data: {
          ...warden._doc,
          status: "approve",
          authorized: true,
          password: undefined
        },
        message: "Warden has been authorized Successfully",
        status: 200
      };
    } catch (error) {
      this.response = {
        error,
        status: 400
      };
    }
    res.status(this.response.status).json(this.response);
  };
  declineWarden = async (req, res) => {
    declineBlock: try {
      const updateFields = {
        status: "decline",
        authorized: false
      };
      const wardenDecline = await WardenApproval.findOneAndUpdate(
        { wardenId: req.body.wardenId, adminId: res.locals.data.id },
        { ...updateFields }
      );
      if (!wardenDecline) {
        this.response = {
          message: "Warden doesn't exists",
          status: 404
        };
        break declineBlock;
      }
      const warden = await Warden.findByIdAndUpdate(req.body.wardenId, {
        ...updateFields
      });

      this.response = {
        data: {
          ...warden._doc,
          ...updateFields,
          password: undefined
        },
        message: "Warden has been Declined",
        status: 200
      };
    } catch (error) {
      this.response = {
        error,
        status: 400
      };
    }
    res.status(this.response.status).json(this.response);
  };

  undoWarden = async(req , res) => {
    undoBlock:try {
      const updateFields = {
        status: "uncheck",
      };
      const wardenUndo = await WardenApproval.findOneAndUpdate(
        { wardenId: req.body.wardenId, adminId: res.locals.data.id },
        { ...updateFields }
      );
      if (!wardenUndo) {
        this.response = {
          message: "Warden doesn't exists",
          status: 404
        };
        break undoBlock;
      }
      const warden = await Warden.findByIdAndUpdate(req.body.wardenId, {
        ...updateFields
      }, { new: true, projection: "-password"  });

      this.response = {
        data: {
          ...warden._doc,
        },
        message: "Warden has been Declined",
        status: 200
      };
    } catch (error) {
      this.response ={
        status: 500,
        error,
        message: "Interal Server Error"
      }
    }
    res.status(this.response.status).json(this.response)
  }
  resetWardenStatus = async (req, res) => {
    try {
      const wardens = await Warden.updateMany(
        {},
        { status: "onhold", authorized: false }
      );

      const wardenApprovalsDeleted = await WardenApproval.deleteMany({});
      res
        .status(200)
        .json({ message: "Warden Updated", wardens, wardenApprovalsDeleted });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  deleteWarden = async (req, res) => {
    try {
      const result = await WardenApproval.findOneAndDelete({
        wardenId: req.body.wardenId,
        adminId: res.locals.data.id
      });
      if (!result) {
        let error = new Error();
        error.messaage = "Not Found";
        error.status = 404;
        throw error;
      }
      const wardenResult = await Warden.findOneAndDelete({
        _id: req.body.wardenId
      });
      res.status(200).json({ result, wardenResult });
    } catch (error) {
      res.status(error?.status ?? 500).json({ ...error });
    }
  };
}

module.exports = new WardenController();
