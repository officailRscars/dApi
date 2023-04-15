const { Car } = require("../models/car");
const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Errorhandler = require("../utils/errorhander");
const router = express.Router();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const multer = require("multer");
const fs = require("fs");
const { error } = require("console");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.post(
  `/newcar`,
  uploadOptions.array("car-Images", 4),
  catchAsyncErrors(async (req, res, next) => {
    async function uploadToClouinary(locaFilePath) {
      return cloudinary.uploader
        .upload(locaFilePath, {
          public_id: "rscars",
        })
        .then((result) => {
          fs.unlinkSync(locaFilePath);
          return {
            url: result.url,
          };
        })
        .catch((error) => {
          fs.unlinkSync(locaFilePath);
          return {
            url: "failed-to-upload",
          };
        });
    }

    let imageUrlList = [];
    for (let index = 0; index < req.files.length; index++) {
      let locaFilePath = req.files[index].path;
      const result = await uploadToClouinary(locaFilePath);
      imageUrlList.push(result.url);
    }

    let car = new Car({
      license_number: req.body.license_number,
      stock_number: req.body.stock_number,
      passenger_capcity: req.body.passenger_capcity,
      has_sunroof: req.body.has_sunroof,
      model: req.body.model,
      brand: req.body.brand,
      manufacturing_year: req.body.manufacturing_year,
      mileage: req.body.mileage,
      total_run: req.body.total_run,
      transmission_type: req.body.transmission_type,
      isFeatured: req.body.isFeatured,
      about_car: req.body.about_car,
      fuelType: req.body.fuelType,
      responsiblities: req.body.responsiblities,
      image1: imageUrlList[0],
      image2: imageUrlList[1],
      image3: imageUrlList[2],
      image4: imageUrlList[3],
    });

    car = await car.save();

    if (!car) {
      return next(new Errorhandler("Something went wrong"));
    }

    res.status(201).json({
      success: true,
      car,
    });
  })
);

router.get(
  `/`,
  catchAsyncErrors(async (req, res, next) => {
    const cars = await Car.find();

    if (!cars) {
      return next(new Errorhandler("No car found at this moment"));
    }

    res.status(201).json({
      success: true,
      cars,
    });
  })
);



router.get("/test", async (req, res) => {
  res.send("Hii From Cars-Routes");
});

module.exports = router;
