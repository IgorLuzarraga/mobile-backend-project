//const { upload } = require("../../middleware/files.middleware");
const {
  create,
//   getAll,
//   getById,
//   getByName,
//   updateCharacter,
//   deleteCharacter,
} = require("../controllers/App.controllers");

const AppRoutes = require("express").Router();

AppRoutes.post("/", create)

//CharacterRoutes.post("/", upload.single("image"), create)
//CharacterRoutes.post("/", create)
// CharacterRoutes.get("/", getAll)
// CharacterRoutes.get("/:id", getById)
// CharacterRoutes.get("/name/:name", getByName)
// CharacterRoutes.patch("/:id", upload.single("image"), updateCharacter)
// CharacterRoutes.delete("/:id", deleteCharacter)

module.exports = AppRoutes;
