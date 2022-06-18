const dotenv = require("dotenv");
dotenv.config({ encoding: false });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function sendSMSVerificationCode(number) {
  try {
    const code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
    const  from = process.env.TWILIO_TRIAL_PHONE_NUMBER
    const response = await client.messages.create({
      body: `Your 4-digit code is: ${code}`,
      from,
      to: number,
    });
    if(!response){
      throw new Error("There was a problem sending verification code. Please try again")
    }

    return {
      message: "Code has been sent successfully",
      status: 200,
      data: {
        sid: response.sid,
        code,
        expireTime: 5 * 60 * 1000,
      },
    };
  } catch (error) {
    return {
      message: error,
      status: 404,
      data: null
    }
  }
}

exports.sendSMS = sendSMSVerificationCode;
