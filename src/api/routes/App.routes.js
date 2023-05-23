//const { upload } = require("../../middleware/files.middleware");
const {
  create,
  getAll,
  getById,
  getByAppName,
  //   updateCharacter,
  deleteApp,
} = require('../controllers/App.controllers');

const AppRoutes = require('express').Router();

AppRoutes.post('/', create);
AppRoutes.delete('/:id', deleteApp);
AppRoutes.get('/', getAll);
AppRoutes.get('/:id', getById);
AppRoutes.get('/appName/:appName', getByAppName);

//CharacterRoutes.post("/", upload.single("image"), create)
//CharacterRoutes.post("/", create)
// CharacterRoutes.get("/", getAll)
// CharacterRoutes.get("/:id", getById)
// CharacterRoutes.get("/name/:name", getByName)
// CharacterRoutes.patch("/:id", upload.single("image"), updateCharacter)
// CharacterRoutes.delete("/:id", deleteCharacter)

module.exports = AppRoutes;
