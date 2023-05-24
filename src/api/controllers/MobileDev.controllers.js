const {
  MobileDevErrors,
  MobileDevSuccess,
  AppErrors,
  AppSuccess,
} = require('../../helpers/jsonResponseMsgs');
const MobileDev = require('../models/MobileDev.model');
const App = require('../models/App.model');
const User = require('../models/user.model');

//! ---------------------------------------------------------------------
//? -------------------------------CREATE ---------------------------------
//! ---------------------------------------------------------------------
const create = async (req, res, next) => {
  try {
    const newMobileDev = new MobileDev(req.body);
    const saveMobileDevs = await newMobileDev.save();
    if (saveMobileDevs) {
      return res.status(200).json(saveMobileDevs);
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_CREATING_MOBILEDEV); //--->comentario feedback
    }
  } catch (error) {
    return next(error);
  }
};

// const create = async (req, res, next) => {
//   try {
//     await MobileDev.syncIndexes();
//     const filterBody = {
//       brand: req.body.brand,
//       OS: req.body.OS,
//       versionOS: req.body.versionOS,
//       language: req.body.language,
//     };

//     const newMobileDev = new MobileDev(filterBody);

//     const { apps } = req.body;

//     const arrayAppsIds = apps.split(',');
//     arrayAppsIds.forEach((item) => {
//       newMobileDev.apps.push(item);
//     });

//     const saveApps = await newMobileDev.save();

//     if (saveApps) {
//       const arrayTest = [];

//       arrayAppsIds.forEach(async (itemID) => {
//         const appId = await App.findById(itemID);

//         await appId.updateOne({
//           $push: { apps: saveApps._id },
//         });

//         const testAppUpdate = await App.findById(itemID);

//         arrayTest.push({
//           idApp: itemID,
//           idMobile: newMobileDev._id,
//           testAppUpdate: testAppUpdate.mobileDevs.includes(saveApps._id)
//             ? true
//             : false,
//         });
//       });

//       return res.status(200).json({
//         newMobileDevs: saveApps,
//         testAppsUpdate: arrayTest,
//       });
//     } else {
//       return res.status(404).json(MobileDevErrors.FAIL_CREATING_MOBILEDEV);
//     }
//   } catch (error) {
//     return next(error);
//   }
// };

//! ---------------------------------------------------------------------
//? ------------------------------GETALL --------------------------------
//! ---------------------------------------------------------------------
// const getAll = async (req, res, next) => {
//   try {
//     const allMovies = await Movie.find().populate("characters");
//     console.log("getAll movies: ", allMovies)
//     if (allMovies) {
//       return res.status(200).json(allMovies);
//     } else {
//       return res.status(404).json(MovieErrors.FAIL_SEARCHING_MOVIES);
//     }
//   } catch (error) {
//     return next(error);
//   }
// };

const getAll = async (req, res, next) => {
  try {
    const allMobileDevs = await MobileDev.find()
      .populate('apps')
      .populate('users');
    //console.log("getAll movies: ", allMobileDevs)
    if (allMobileDevs) {
      return res.status(200).json(allMobileDevs);
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_SEARCHING_MOBILEDEV);
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
    const mobileDevById = await MobileDev.findById(id)
      .populate('apps')
      .populate('users');
    if (mobileDevById) {
      return res.status(200).json(mobileDevById);
    } else {
      return res
        .status(404)
        .json(MobileDevErrors.FAIL_SEARCHING_MOBILEDEV_BY_ID);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- GET BY Brand ---------------------------
//! ---------------------------------------------------------------------

const getByBrand = async (req, res, next) => {
  try {
    const { brand } = req.params;

    const mobileDevByName = await MobileDev.find({ brand }).populate('apps');

    if (mobileDevByName) {
      return res.status(200).json(mobileDevByName);
    } else {
      return res
        .status(404)
        .json(MobileDevErrors.FAIL_SEARCHING_MOBILEDEV_BY_NAME);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- UPDATE --------------------------------
//! ---------------------------------------------------------------------

const updateMobileDev = async (req, res, next) => {
  try {
    const filterBody = {
      brand: req.body.brand,
      OS: req.body.OS,
      versionOS: req.body.versionOS,
      language: req.body.language,
    };
    const { id } = req.params;
    const mobilDevById = await MobileDev.findById(id);
    if (mobilDevById) {
      const patchApp = new MobileDev(filterBody);
      patchApp._id = id;
      await MobileDev.findByIdAndUpdate(id, patchApp); // Guardar los cambios en la base de datos
      return res.status(200).json(await MobileDev.findById(id)); // Responder con el objeto actualizado
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_UPDATING_MOBILEDEV); // Manejar el caso cuando no se encuentra la aplicación
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- DELETE --------------------------------
//! ---------------------------------------------------------------------

const deleteMobileDev = async (req, res, next) => {
  try {
    // We get the id from params
    const { id } = req.params;

    const deleteMobileDev = await MobileDev.findByIdAndDelete(id);

    // esto anterior nos devuelve siempre el elemento buscado pero puede ser que
    //no haya borrado por eso cuidado

    if (deleteMobileDev) {
      await App.updateMany({ mobileDevs: id }, { $pull: { mobileDevs: id } });

      const testApp = await App.find({ mobileDevs: id });

      return res.status(200).json({
        deleteMobileDev: deleteMobileDev,
        testDelete: (await MobileDev.findById(id))
          ? MobileDevErrors.FAIL_DELETING_MOBILEDEV
          : MobileDevSuccess.SUCCESS_DELETING_MOBILEDEV,
        testUpdate:
          testApp.length > 0
            ? AppErrors.FAIL_UPDATING_APP
            : AppSuccess.SUCCESS_UPDATING_APP,
      });
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_DELETING_MOBILEDEV);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- UPDATE APP--------------------------------
//! ---------------------------------------------------------------------

const updateApp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldMobileDev = await MobileDev.findByIdAndUpdate(id, req.body);
    if (oldMobileDev) {
      return res.status(200).json({
        oldMobileDev: oldMobileDev,
        newMobileDev: await MobileDev.findById(id), //meter mensaje feedback
      });
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_UPDATING_MOBILEDEV);
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
    const mobileFav = await MobileDev.findById(req.params.id); //--->MobileDEv
    const user = await User.findById(req.user._id); //--->Nuestro user

    if (!mobileFav.users.includes(user._id)) {
      await mobileFav.updateOne({ $push: { users: user._id } });
      await user.updateOne({ $push: { mobileDevs: mobileFav._id } });
      res.status(200).json('The activity has been added');
    } else {
      await mobileFav.updateOne({ $pull: { users: user._id } });
      await user.updateOne({ $pull: { mobileDevs: mobileFav._id } });
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
  getByBrand,
  updateMobileDev,
  deleteMobileDev,
  addFavorite,
  updateApp,
};
