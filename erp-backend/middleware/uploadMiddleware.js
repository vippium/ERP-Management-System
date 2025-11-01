import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit; Easily adjustable as need
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes("csv") && !file.originalname.match(/\.csv$/i)) {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
