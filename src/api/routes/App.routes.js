//const { upload } = require("../../middleware/files.middleware");
const { isAuth, isAuthAdmin } = require('../../middleware/auth.middleware');

const {
  create,
  getAll,
  getById,
  getByAppName,
  updateApp,
  deleteApp,
  addFavorite,
  updateMobileDev,
} = require('../controllers/App.controllers');

const AppRoutes = require('express').Router();

AppRoutes.post('/', create);
AppRoutes.delete('/:id', deleteApp);
AppRoutes.get('/', getAll);
AppRoutes.get('/:id', getById);
AppRoutes.get('/appName/:appName', getByAppName);
AppRoutes.patch('/:id', updateApp);
AppRoutes.patch('/updateMobileDev/:id', updateMobileDev);
AppRoutes.put('/favorite/:id', [isAuth], addFavorite); //----id del usuario

//CharacterRoutes.post("/", upload.single("image"), create)
//CharacterRoutes.post("/", create)
// CharacterRoutes.get("/", getAll)
// CharacterRoutes.get("/:id", getById)
// CharacterRoutes.get("/name/:name", getByName)
// CharacterRoutes.patch("/:id", upload.single("image"), updateCharacter)
// CharacterRoutes.delete("/:id", deleteCharacter)

module.exports = AppRoutes;
