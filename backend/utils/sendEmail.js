import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  auth: {
    user: "*",
    pass: "*",
  },
});

export default transporter;
