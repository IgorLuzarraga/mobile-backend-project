const { deleteImgCloudinary } = require('../../middleware/files.middleware');
const Character = require('../models/Character.model');
const Movie = require('../models/Movies.model');
const App = require('../models/App.model');
const MobileDev = require('../models/MobileDev.model');
const User = require('../models/user.model');
const {
  MobileDevErrors,
  AppErrors,
  AppSuccess,
} = require('../../helpers/jsonResponseMsgs');

//! ---------------------------------------------------------------------
//? -------------------------------CREATE ---------------------------------
//! ---------------------------------------------------------------------
const create = async (req, res, next) => {
  try {
    const newApp = new App(req.body);
    const saveApp = await newApp.save();
    if (saveApp) {
      return res.status(200).json(saveApp);
    } else {
      return res.status(404).json(AppErrors.FAIL_CREATING_APP);
    }
  } catch (error) {
    return next(error);
  }
};

// const create = async (req, res, next) => {
//   //! capturo la url para si luego la tengo que borrar y le pongo el optional chaining (?) para que no me rompa en caso que no tenga la clave path
//   //let catchImg = req.file?.path;

//   try {
//     await App.syncIndexes();
//     const filterBody = {
//       appName: req.body.appName,
//       category: req.body.category,
//       codeLanguages: req.body.codeLanguages,
//       appSize: req.body.appSize,
//     };

//     // cremos un nuevo modelo con los datos que nos trae la request body
//     const newApp = new App(filterBody);

//     //console.log("body: ", req.body)

//     // cogemos las movies del req.body y las recorremos
//     const { mobileDevs } = req.body;

//     //console.log("mobileDevs: ", mobileDevs)

//     const arrayMobileDevsIds = mobileDevs.split(',');
//     arrayMobileDevsIds.forEach((item) => {
//       newApp.mobileDevs.push(item);
//     });
//     console.log('newApp: ', newApp);
//     // lo guardamos en la db
//     const saveMobileDevs = await newApp.save();
//     // evaluamos que se haya efectuado correctamente
//     if (saveMobileDevs) {
//       // si es un si: envio un 200 y un json con el objeto postedo
//       const arrayTest = [];
//       arrayMobileDevsIds.forEach(async (itemID) => {
//         const mobileById = await MobileDev.findById(itemID);
//         await mobileById.updateOne({
//           $push: { apps: saveMobileDevs._id },
//         });
//         const testUpdateMobileDev = await MobileDev.findById(itemID);
//         arrayTest.push({
//           idMobile: itemID,
//           idApp: newApp._id,
//           testMobileDesUpdate: testUpdateMobileDev.apps.includes(
//             saveMobileDevs._id
//           )
//             ? true
//             : false,
//         });
//       });

//       return res.status(200).json({
//         newApp: saveMobileDevs,
//         testMobileDevUpdate: arrayTest,
//       });
//     } else {
//       // si es un no: envio un 404 not found, de que no se ha enviado en elemento a la base de datos
//       return res.status(404).json(MobileDevErrors.FAIL_CREATING_MOBILEDEV); // TODO: Actualizar a error de APP
//     }
//   } catch (error) {
//     return next(error);
//   }
// };

//! ---------------------------------------------------------------------
//? ------------------------------GET ALL -------------------------------
//! ---------------------------------------------------------------------

const getAll = async (req, res, next) => {
  try {
    // ES EL FIND DE LA QUERY DE MONGOOSE NOS TRAE TODOS LOS ELEMENTOS
    const allApp = await App.find().populate('mobileDevs');
    if (allApp) {
      return res.status(200).json(allApp);
    } else {
      return res.status(404).json(AppErrors.FAIL_SEARCHING_APP);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GETBYID -------------------------------
//! ---------------------------------------------------------------------
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appById = await App.findById(id).populate('mobileDevs');
    if (appById) {
      return res.status(200).json(appById);
    } else {
      return res.status(404).json(AppErrors.FAIL_SEARCHING_APP_BY_ID);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- GET BY APPNAME ---------------------------
//! ---------------------------------------------------------------------

const getByAppName = async (req, res, next) => {
  try {
    const { appName } = req.params;

    const AppNameByName = await App.find({ appName });

    if (AppNameByName) {
      return res.status(200).json(AppNameByName);
    } else {
      return res.status(404).json(AppErrors.FAIL_SEARCHING_APP_BY_NAME);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- UPDATE --------------------------------
//! ---------------------------------------------------------------------
const updateAppHelper = (oldApp, req) => {
  const newApp = new App(oldApp);
  const oldAppKeys = Object.keys(req.body);
  oldAppKeys.forEach((key) => {
    newApp[key] = req.body[key];
  });
  return newApp;
};
const updateApp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appById = await App.findById(id);
    if (appById) {
      const patchApp = updateAppHelper(appById, req);
      patchApp._id = id;
      const saveApp = await App.findByIdAndUpdate(id, patchApp); // Guardar los cambios en la base de datos
      return res.status(200).json(await App.findById(id)); // Responder con el objeto actualizado
    } else {
      return res.status(404).json(AppErrors.FAIL_UPDATING_APP); // Manejar el caso cuando no se encuentra la aplicación
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- UPDATE MOBILEDEV--------------------------------
//! ---------------------------------------------------------------------

const updateMobileDev = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldApp = await App.findByIdAndUpdate(id, req.body);
    if (oldApp) {
      return res.status(200).json({
        oldApp: oldApp,
        newApp: await App.findById(id), //meter mensaje feedback
      });
    } else {
      return res.status(404).json(AppErrors.FAIL_UPDATING_APP);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- DELETE --------------------------------
//! ---------------------------------------------------------------------

const deleteApp = async (req, res, next) => {
  try {
    // We get the id from params
    const { id } = req.params;

    // We find by Id and remove it
    const deleteApp = await App.findByIdAndDelete(id);

    // deleteCountry contains the removed element,
    // but sometimes dosen't work, so watch out!
    if (deleteApp) {
      // We check if the deleted element is in the DB,
      // if don't, we remove the image from Cloudinary
      // if the element was not remove, we call next and finish the execution
      if (await App.findById(id)) {
        // The App is still in the DB, so something went wrong
        // and we didn't delete it!
        // We can't do anything else, just report it!
        next(AppErrors.FAIL_DELETING_APP);
      } else {
        // The App was removed successfully!

        // delete image from cloudinary
        //deleteImgCloudinary(deleteApp.image);

        // Update the Movie collection, but just the Apps with the
        // Id id
        await MobileDev.updateMany(
          { Apps: id }, // filter elements to update them
          {
            // pull removes the elements
            // that math the filter { apps: id },
            $pull: { apps: id },
          }
        );
      }

      // If everithhing went ok, we return a 200 Ok.
      // Just in case, we realize a test to check if the movie App
      // was removed correctly
      return res.status(200).json({
        deleteObject: deleteApp,
        test: (await App.findById(id))
          ? AppErrors.FAIL_DELETING_APP_TEST
          : AppSuccess.SUCCESS_DELETING_APP,
      });
    } else {
      return res.status(404).json(AppErrors.FAIL_DELETING_APP);
    }
  } catch (error) {
    return next(error);
  }
};
//! ---------------------------------------------------------------------
//? ------------------------------GETFAV --------------------------------
//! ---------------------------------------------------------------------
const addFavorite = async (req, res, next) => {
  try {
    const appFav = await App.findById(req.params.id); //--->MobileDEv

    const user = await User.findById(req.user._id); //--->Nuestro user

    if (!appFav.users.includes(user._id)) {
      await appFav.updateOne({ $push: { users: user._id } });
      await user.updateOne({ $push: { events: appFav._id } });
      res.status(200).json('The activity has been added');
    } else {
      await appFav.updateOne({ $pull: { users: user._id } });
      await user.updateOne({ $pull: { events: appFav._id } });
      res.status(200).json('The activity has not been added');
    }
  } catch (error) {
    return next('error handle add event', error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getByAppName,
  updateApp,
  deleteApp,
  addFavorite,
  updateMobileDev,
};
