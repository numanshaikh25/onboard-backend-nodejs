import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Employee from "../models/employeeModel.js";
import multer from "multer";
import path from "path";
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import Invite from "../models/inviteModel.js";
import Notification from "../models/notificationModel.js";
import transporter from "../utils/sendEmail.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
function checkFileType(file, cb) {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Pdf only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.route("/addemployee").post(
  protect,
  upload.fields([
    {
      name: "aadhar_card",
      maxCount: 1,
    },
    {
      name: "pan_card",
      maxCount: 1,
    },
    {
      name: "passport",
      maxCount: 1,
    },
    {
      name: "driving_license",
      maxCount: 1,
    },
  ]),
  asyncHandler(async (req, res) => {
    let user = req.user;
    let driving_license;
    const email = req.body.email;
    const employeeExists = await Employee.findOne({ email: email });
    const invited_employee = await Invite.findOne({ email: email });
    console.log(invited_employee);

    if (employeeExists) {
      res.status(400);
      throw new Error("Employee already exists");
    }
    if (req.files && req.files.driving_license) {
      driving_license = req.files.driving_license[0];
    }
    if (driving_license) {
      const employee = await Employee.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: email,
        gender: req.body.gender,
        age: req.body.age,
        mobile_number: req.body.mobile_number,
        address: req.body.address,
        role: req.body.role,
        bank_name: req.body.bank_name,
        account_no: req.body.account_no,
        ifsc_code: req.body.ifsc_code,
        bank_branch_location: req.body.bank_branch_location,
        aadhar_card: req.files.aadhar_card[0].path,
        pan_card: req.files.pan_card[0].path,
        passport: req.files.passport[0].path,
        driving_license: req.files.driving_license[0].path,
      })
        .then((result) => {
          console.log(result);
          if (invited_employee && invited_employee.email == email) {
            const message =
              "The employee with email " +
              String(email) +
              " you invited has registered";
            const notification = Notification.create({ message: message });
          }
          if (user.email == email) {
            user.is_registered = true;
            user.save();
          }
          res.json({ success: "Employee added" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    } else {
      const employee = await Employee.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: email,
        gender: req.body.gender,
        age: req.body.age,
        mobile_number: req.body.mobile_number,
        address: req.body.address,
        role: req.body.role,
        bank_name: req.body.bank_name,
        account_no: req.body.account_no,
        ifsc_code: req.body.ifsc_code,
        bank_branch_location: req.body.bank_branch_location,
        aadhar_card: req.files.aadhar_card[0].path,
        pan_card: req.files.pan_card[0].path,
        passport: req.files.passport[0].path,
      })
        .then((result) => {
          console.log(result);
          if (invited_employee && invited_employee.email == email) {
            const message =
              "The employee with email " +
              String(email) +
              " you invited has registered";
            notification = Notification.create({ message: message });
          }
          if (user.email == email) {
            user.is_registered = true;
            user.save();
          }
          res.json({ success: "Employee added" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    }
  })
);
router.route("/invite").post(
  protect,
  admin,
  upload.none(),
  asyncHandler(async (req, res) => {
    const email = req.body.email;
    console.log(email);
    const user = req.user;
    const message = {
      from: "testcrinitis@gmail.com",
      to: email,
      subject: "You are invited to regsiter yourself",
      text:
        "From " +
        String(user.email) +
        "\n" +
        "We have invited you to signup on our platform and register your details on" +
        "\n" +
        "https://onboard-crinitis-nodejs.herokuapp.com/signup/",
    };
    transporter.sendMail(message, function (err, info) {
      if (err) {
        res.status(400);
        throw new Error(err);
      } else {
        res.json({ success: "Email sent" });
      }
      const invite = Invite.create({
        email,
      });
    });
  })
);
router.route("/updateemployeedocuments/:id").put(
  protect,
  upload.fields([
    {
      name: "aadhar_card",
      maxCount: 1,
    },
    {
      name: "pan_card",
      maxCount: 1,
    },
    {
      name: "passport",
      maxCount: 1,
    },
    {
      name: "driving_license",
      maxCount: 1,
    },
  ]),
  asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      if (req.files && req.files.aadhar_card) {
        employee.aadhar_card = req.files.aadhar_card[0].path;
      }
      if (req.files && req.files.pan_card) {
        employee.pan_card = req.files.pan_card[0].path;
      }
      if (req.files && req.files.passport) {
        employee.passport = req.files.passport[0].path;
      }
      if (req.files && req.files.driving_license) {
        employee.driving_license = req.files.driving_license[0].path;
      }
      const updatedEmployee = await employee.save();

      res.json({ success: "Employee documents are updated" });
    } else {
      res.status(404);
      throw new Error("Employee not found");
    }
  })
);

router.route("/updateemployeedetails/:id").put(
  protect,
  upload.none(),
  asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      employee.first_name = req.body.first_name;
      employee.last_name = req.body.last_name;
      employee.email = req.body.email;
      employee.gender = req.body.gender;
      employee.age = req.body.age;
      employee.mobile_number = req.body.mobile_number;
      employee.address = req.body.address;
      employee.role = req.body.role;
      employee.bank_name = req.body.bank_name;
      employee.account_no = req.body.account_no;
      employee.ifsc_code = req.body.ifsc_code;
      employee.bank_branch_location = req.body.bank_branch_location;
      const updatedEmployee = await employee.save();

      res.json({ success: "Employee details are updated" });
    } else {
      res.status(404);
      throw new Error("Employee not found");
    }
  })
);

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({});
  res.json({ employees: employees });
});

const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    res.json({ employee: employee });
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
});

// const updateDetails = asyncHandler(async (req, res) => {
//   const employee = await Employee.findById(req.params.id);

//   if (employee) {
//     employee.first_name = req.body.first_name;
//     employee.last_name = req.body.last_name;
//     employee.email = req.body.email;
//     employee.gender = req.body.gender;
//     employee.age = req.body.age;
//     employee.mobile_number = req.body.mobile_number;
//     employee.address = req.body.address;
//     employee.role = req.body.role;
//     employee.bank_name = req.body.bank_name;
//     employee.account_no = req.body.account_no;
//     employee.ifsc_code = req.body.ifsc_code;
//     employee.bank_branch_location = req.body.bank_branch_location;

//     const updatedEmployee = await employee.save();

//     res.json({ sucess: "Employee details are updated" });
//   } else {
//     res.status(404);
//     throw new Error("Employee not found");
//   }
// });

const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    await employee.remove();
    res.json({ success: "Employee removed" });
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
});

router.route("/getemployees").get(protect, getEmployees);
router.route("/getemployee/:id").get(protect, getEmployee);
router.route("/deleteemployee/:id").delete(protect, deleteEmployee);
// router.route("/updateemployeedetails/:id").put(protect, updateDetails);
export { getEmployees };

export default router;
