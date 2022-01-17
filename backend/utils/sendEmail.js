import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  auth: {
    user: "testcrinitis@gmail.com",
    pass: "cbmunwumrypewhjz",
  },
});

export default transporter;
