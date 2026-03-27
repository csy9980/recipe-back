const express = require("express");
const models = require("./models");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;
app.use(express.json());
const uploadDir = `public/uploads`;
app.use("/uploads", express.static(path.join(__dirname, uploadDir)));

// 멀터 저장소
const storage = multer.diskStorage({
  destination: `./${uploadDir}`,
  filename: function (req, file, cb) {
    const fileName =
      path.parse(file.originalname).name +
      "-" +
      Date.now() +
      path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
