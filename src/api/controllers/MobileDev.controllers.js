const { 
  MobileDevErrors, 
  MobileDevSuccess,
  AppErrors,
  AppSuccess,
 } = require("../../helpers/jsonResponseMsgs");
const { MovieSuccess } = require("../../helpers/jsonResponseMsgs");
const { CharacterErrors } = require("../../helpers/jsonResponseMsgs");
const { CharacterSuccess } = require("../../helpers/jsonResponseMsgs");
const Character = require("../models/Character.model");
const MobileDev = require("../models/MobileDev.model");
const Movie = require("../models/Movies.model");
const App = require("../models/App.model");

//! ---------------------------------------------------------------------
//? -------------------------------POST ---------------------------------
//! ---------------------------------------------------------------------

const create = async (req, res, next) => {
  try {
    const newMobile = new MobileDev(req.body);
    const saveMobile = await newMobile.save();
    if (saveMobile) {
      return res.status(200).json(saveMobile);
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_CREATING_MOBILEDEV);
    }
  } catch (error) {
    return next(error);
  }
};

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
    const allMobileDevs = await MobileDev.find().populate("apps");
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
    const movieById = await Movie.findById(id).populate("characters");
    if (movieById) {
      return res.status(200).json(movieById);
    } else {
      return res.status(404).json(MovieErrors.FAIL_SEARCHING_MOVIE_BY_ID);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- GET BY NAME ---------------------------
//! ---------------------------------------------------------------------

const getByName = async (req, res, next) => {
  try {
    
    const { name } = req.params;
    console.log("MOVIE NAME: ", name)

    const movieByName = await Movie.find({ name }).populate('character')

    if (movieByName) {
      return res.status(200).json(movieByName);
    } else {
      return res.status(404).json(MovieErrors.FAIL_SEARCHING_MOVIE_BY_NAME);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- UPDATE --------------------------------
//! ---------------------------------------------------------------------

const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldNovie = await Movie.findByIdAndUpdate(id, req.body);
    if (updateMovie) {
      return res.status(200).json({
        oldMovie: oldNovie,
        newMovie: await Movie.findById(id),
      });
    } else {
      return res.status(404).json(MovieErrors.FAIL_UPDATING_MOVIE);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- DELETE --------------------------------
//! ---------------------------------------------------------------------

// const deleteMobileDev = async (req, res, next) => {
//   try {
//     // We get the id from params
//     const { id } = req.params;

//     const deleteMovie = await Movie.findByIdAndDelete(id);

//     // esto anterior nos devuelve siempre el elemento buscado pero puede ser que 
//     //no haya borrado por eso cuidado
    
//     if (deleteMovie) {
//       await Character.updateMany({ movies: id }, { $pull: { movies: id } });

//       const testCharacter = await Character.find({ movies: id });

//       return res.status(200).json({
//         deleteMovie: deleteMovie,
//         test: 
//           (await Movie.findById(id)) 
//             ? MovieErrors.FAIL_DELETING_MOVIE 
//             : MovieSuccess.SUCCESS_DELETING_MOVIE,
//         test:
//           testCharacter.length > 0
//             ? CharacterErrors.FAIL_UPDATING_CHARACTER
//             : CharacterSuccess.SUCCESS_UPDATING_CHARACTER,
//       });
//     } else {
//       return res.status(404).json(MovieErrors.FAIL_DELETING_MOVIE);
//     }
//   } catch (error) {
//     return next(error);
//   }
// };

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
        test: 
          (await MobileDev.findById(id)) 
            ? MobileDevErrors.FAIL_DELETING_MOBILEDEV 
            : MobileDevSuccess.SUCCESS_DELETING_MOBILEDEV,
        test:
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

module.exports = {
  create,
  getAll,
  getById,
  getByName,
  updateMovie,
  //deleteMovie,
  deleteMobileDev
};
