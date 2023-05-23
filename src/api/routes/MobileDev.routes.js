const express = require("express");
const {
  create,
  getAll,
  deleteMobileDev,
  getById,
  getByBrand,
  updateMobileDev,
//   updateMovie,
//   deleteMovie,
} = require("../controllers/MobileDev.controllers");

const MobileRoutes = express.Router();

MobileRoutes.post("/", create)
MobileRoutes.get("/", getAll)
MobileRoutes.delete("/:id", deleteMobileDev)
MobileRoutes.get("/:id", getById)
MobileRoutes.get("/brand/:brand", getByBrand)
MobileRoutes.patch("/:id", updateMobileDev)
// MobileRoutes.patch("/:id", updateMovie)
// MobileRoutes.delete("/:id", deleteMovie)

module.exports = MobileRoutes
