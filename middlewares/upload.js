const multer = require("multer");
const path = require("path");
const uploadDir = `public/uploads`;

const storage = multer.diskStorage({
  destination: `./${uploadDir}`,
  filename: function (req, file, cb) {
    let originalName = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    const fname = originalName + "-" + Date.now() + path.extname(originalName);
    cb(null, fname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadSingle = upload.single("file");
const uploadMulti = upload.array("files", 5);
module.exports = {
  uploadSingle,
  uploadMulti,
};
