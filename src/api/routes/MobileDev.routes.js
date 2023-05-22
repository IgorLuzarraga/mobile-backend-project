const express = require("express");
const {
  create,
//   getAll,
//   getById,
//   getByName,
//   updateMovie,
//   deleteMovie,
} = require("../controllers/MobileDev.controllers");

const MobileRoutes = express.Router();

MobileRoutes.post("/", create)
// MobileRoutes.get("/", getAll)
// MobileRoutes.get("/:id", getById)
// MobileRoutes.get("/name/:name", getByName)
// MobileRoutes.patch("/:id", updateMovie)
// MobileRoutes.delete("/:id", deleteMovie)

module.exports = MobileRoutes
