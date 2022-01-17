import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";

import employeeController from "./controllers/employeeController.js";
import bodyParser from "body-parser";
import multer from "multer";
import notificationRoutes from "./routes/notificationRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
const upload = multer();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors());

// app.use(upload.array());
// app.use(express.static("public"));

// app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
// app.use(bodyParser.json()); // Send JSON responses

app.use("/api/users", userRoutes);

app.use("/api/employee", employeeController);
app.use("/api/employee", notificationRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
