import mongoose from "mongoose";

const employeeSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  mobile_number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  bank_name: {
    type: String,
    required: true,
  },
  account_no: {
    type: String,
    required: true,
  },
  ifsc_code: {
    type: String,
    required: true,
  },
  bank_branch_location: {
    type: String,
    required: true,
  },
  aadhar_card: {
    type: String,
    required: true,
  },
  pan_card: {
    type: String,
    required: true,
  },
  passport: {
    type: String,
    required: true,
  },
  driving_license: {
    type: String,
    required: false,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
