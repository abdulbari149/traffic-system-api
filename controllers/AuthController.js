const { hash, compare } = require("bcrypt");
const { sendSMS } = require("../lib/twilioSMS");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models")
class AuthController {
  response = {
    message: "",
    data: null,
    status: null,
  };

  checkUserExists = async (req, res) => {
    const { email } = req.body;
    const { DbModel } = res.locals;
    try {
      const doc = await DbModel.findOne({ email });
      if (doc) {
        this.response = {
          message: "A warden with the email address already exists",
          data: {
            userExists: true,
          },
          status: 200,
        };
      } else {
        this.response = {
          status: 200,
          message: "You can signup",
          data: {
            userExists: false,
          },
        };
      }
    } catch (error) {
      this.response = {
        message: error.message,
        status: 404,
      };
    }
    res.status(this.response.status).json(this.response);
  };

  register = async (req, res) => {
    try {
      const { DbModel } = res.locals;
      const { password, confirm_password, ...user } = req.body;
      const hashedPassword = await hash(password, 10);
      const data = await DbModel.create({
        ...user,
        password: hashedPassword,
      });
      this.response = {
        message: "Successfully Saved",
        status: 200,
        data,
      };
    } catch (error) {
      this.response = {
        message: "Error Occured!",
        status: 404,
        data: error,
      };
    }
    res.status(this.response.status).json(this.response);
  };

  registerAdmin = async (req, res) => {
    try {
      const adminData = req.body
      const adminExists = await Admin.findOne({ email: req.body.email })
      if(adminExists){
        let error = new Error("Admin already exists")
        error.status = 403
        throw error
      }
      const hashedPassword = await hash(req.body.password, 10);
      adminData.password = hashedPassword
      adminData.role = "admin"
      const admin = await Admin.create(adminData)
      if(!admin){
        let error = new Error("Error Creating admin")
        error.status = 500
        throw error
      }
      this.response = {
        status: 201,
        message: "Warden Created Successfully"
      }
    }catch(error){
      this.response = {
        message: error.message,
        status: error?.status ?? 500
      }
    }finally{
      res.status(this.response.status).json(this.response)
    }
  }

  login = async (req, res) => {
    const { password, ...param } = req.body;
    const { DbModel } = res.locals;
    loginBlock: try {
      const doc = await DbModel.findOne(param);
      if (!doc) {
        this.response = {
          message: `Wrong Credentials: ${Object.keys(param)[0]}`,
          status: 400,
        };
        break loginBlock;
      }
      const isAuthorized = await compare(password, doc.password);
      if (!isAuthorized) {
        this.response.message = "You have entered a wrong password";
        this.response.status = 400;
        break loginBlock;
      }
      if (req.params.user === "warden" && !doc.authorized) {
        this.response = {
          message: "You are currently unauthorized to access the application",
          status: 403,
          data: null,
        };
        break loginBlock;
      }

      this.response.message = `${req.params.user} is authorized to access the application`;
      this.response.status = 200;

      const token = jwt.sign(
        {
          ...param,
          id: doc._id,
          name: doc?.name ?? `${doc?.first_name} ${doc?.last_name}`,
          ...(req.params.user === "warden" && {
            designation: doc?._doc.designation,
            traffic_sector: doc?._doc.traffic_sector,
            service_id: doc?._doc.service_id
          }),
          ...(req.params.user === "admin" && {
            role: doc?._doc?.role
          })
        },
        process.env.JWTSecret,
        {
          expiresIn: 12 * 60 * 60,
        }
      );
      this.response.data = {
        ...doc._doc,
        password: undefined,
        authorized: undefined,
        token,
      };
      res.setHeader("Authorization", `Bearer ${token}`);
    } catch (error) {
      this.response = {
        message: "Bad Request",
        status: 400,
        data: null,
      };
    } finally {
      res.status(this.response.status).json(this.response);
    }
  };

  sendVerificationCode = async (req, res) => {
    const { phone_number } = req.body;
    return sendSMS(phone_number).then((data) => {
      return res.status(data.status).send(data);
    });
  };

  forgetPassword = async (req, res) => {
    const { email } = req.body;
    const { DbModel } = res.locals;

    forgetPasswordBlock: try {
      const doc = await DbModel.findOne({ email });
      if (!doc) {
        this.response.message =
          "A User with the specificed email doesn't exist";
        this.response.status = 400;
        break forgetPasswordBlock;
      }

      if (req.params.user === "warden" && !doc?.authorized) {
        this.response = {
          message: "You are currently unauthorized",
          status: 403,
          data: null,
        };
        break forgetPasswordBlock;
      }


      const token = jwt.sign(
        {
          email,
        },
        process.env.JWTSecret,
        {
          expiresIn: 5 * 60 * 1000,
        }
      );
      res.setHeader("Authorization", `Bearer ${token}`);
      this.response = {
        message: "You can change your password",
        data: {
          phone_number: doc.phone_number,
          token
        },
        status: 200,
      };
    } catch (error) {
      this.response = {
        message: error,
        status: 404,
        data: null,
      };
    } finally {
     
      res.status(this.response.status).json(this.response);
    }
  };

  changePassword = async (req, res) => {
    changePasswordBlock: try {
      const {
        DbModel,
        data: { email, ...extras },
      } = res.locals;
      const { password } = req.body;
      const hashedPassword = await hash(password, 10);
      const doc = await DbModel.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      );

      if (doc.password !== password) {
        this.response = {
          message: "Password has been changed successfully",
          status: 200,
        };
        break changePasswordBlock;
      }
    } catch (error) {
      this.response = {
        message: error,
        status: 404,
      };
    }

    res.status(this.response.status).json(this.response);
  };

  logout = async(req,res) => {
    res.status(200).json({ message: "Successfully Logout" })
  }
}

module.exports = new AuthController();
