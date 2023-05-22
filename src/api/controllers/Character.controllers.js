const { deleteImgCloudinary } = require("../../middleware/files.middleware");
const Character = require("../models/Character.model");
const Movie = require("../models/Movies.model");

//! ---------------------------------------------------------------------
//? -------------------------------POST ---------------------------------
//! ---------------------------------------------------------------------

const create = async (req, res, next) => {
  //! capturo la url para si luego la tengo que borrar y le pongo el optional chaining (?) para que no me rompa en caso que no tenga la clave path
  let catchImg = req.file?.path;

  try {
    await Character.syncIndexes()

    const filterBody = {
      name: req.body.name,
      gender: req.body.gender,
    }

    // cremos un nuevo modelo con los datos que nos trae la request body
    const newCharacter = new Character(filterBody);

    // cogemos las movies del req.body y las recorremos
    const { movies } = req.body
    
    const arrayMovieIds = movies.split(",");
    arrayMovieIds.forEach((item) => {
      newCharacter.movies.push(item);
    });

    // si nos envia imagen metemos la que nos dan sino metemos una foto general
    if (req.file) {
      newCharacter.image = req.file.path;
    } else {
      newCharacter.image = "https://pic.onlinewebfonts.com/svg/img_181369.png";
    }

    // lo guardamos en la db
    const saveCharacter = await newCharacter.save();

    // evaluamos que se haya efectuado correctamente
    if (saveCharacter) {
      // si es un si: envio un 200 y un json con el objeto postedo

      const arrayTest = []

      arrayMovieIds.forEach(async (itemID) => {
        const movieById = await Movie.findById(itemID)
        
        await movieById.updateOne({
          $push: { characters: saveCharacter._id },
        })

        const testUpdateMovie = await Movie.findById(itemID)

        arrayTest.push({
          idMovie: itemID,
          idCharacter: newCharacter._id,
          testMovieUpdate: testUpdateMovie.characters.includes(
            saveCharacter._id
          )
            ? true
            : false,
        });
      });

      return res.status(200).json({
        newCharacter: saveCharacter,
        testMovieUpdate: arrayTest,
      });
    } else {
      // si es un no: envio un 404 not found, de que no se ha enviado en elemento a la base de datos
      return res.status(404).json(FAIL_CREATING_CHARACTER);
    }
  } catch (error) {
    // lanzo por el next el error a nivel general de try cach para tener constancia en el log de este error
    deleteImgCloudinary(catchImg);

    return next(error);
  }
};



//! ---------------------------------------------------------------------
//? ------------------------------GETALL --------------------------------
//! ---------------------------------------------------------------------
const getAll = async (req, res, next) => {
  try {
    // ES EL FIND DE LA QUERY DE MONGOOSE NOS TRAE TODOS LOS ELEMENTOS
    const allCharacter = await Character.find().populate("movies");
    if (allCharacter) {
      return res.status(200).json(allCharacter);
    } else {
      return res.status(404).json(FAIL_SEARCHING_CHARACTERS);
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
    const characterById = await Character.findById(id).populate("movies");
    if (characterById) {
      return res.status(200).json(characterById);
    } else {
      return res.status(404).json(FAIL_SEARCHING_CHARACTER_BY_ID);
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

    const characterByName = await Character.find({ name });

    if (characterByName) {
      return res.status(200).json(characterByName);
    } else {
      return res.status(404).json(FAIL_SEARCHING_CHARACTER_BY_NAME)
    }

  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- UPDATE --------------------------------
//! ---------------------------------------------------------------------

// We made a copy old the passed character
const updateCharacterHelper = (oldCharacter, req) => {
  const newCharater = new Character(oldCharacter)

  const oldCharacterKeys = Object.keys(req.body);

  oldCharacterKeys.forEach((key) => {
    newCharater[key] = req.body[key]
  })

   // si he recibido un archivo se lo meto en la clave image
  if (req.file) {
    newCharater.image = req.file.path;
  } 

  return newCharater
}

  const updateCharacter = async (req, res, next) => {
    //! capturo la url para si luego la tengo que borrar y le pongo el 
    // optional chaining (?) para que no me rompa en caso que no tenga 
    // la clave path
    let catchImg = req.file?.path 
  
    try {
      const { id } = req.params
  
      /// vamos a buscar que exista este character en la base de datos
      const characterById = await Character.findById(id)
  
      /// guardamos la url de la imagen antigua
      const oldImg = characterById.image
  
      //! SI EXISTE ESTE CHARACTER ENTONCES ME HACES LA LOGICA DEL UPDATE
      if (characterById) {
        // Me instancio un nuevo objeto del modelo Character
        //const patchCharacter = new Character(req.body);
        //const patchCharacter = copyCharacter(req.body)

        const patchCharacter = updateCharacterHelper(
            characterById, 
            req
          )
  
        //! IMPORTANTE --> METER EL ID ANTIGUO PARA QUE NO CAMBIE
        patchCharacter._id = id;
  
        // // si he recibido un archivo se lo meto en la clave image
        // if (req.file) {
        //   patchCharacter.image = req.file.path;
        // } else {
        //   // si no lo recibo me quedo con el antiguo
        //   patchCharacter.image = oldImg;
        // }
  
        // HACEMOS LA QUERY DE MONGOOSE DE ENCONTRAR POR ID Y ACTUALIZAR
        const saveCharacter = await Character.findByIdAndUpdate(
          id,
          patchCharacter
        );
        // EVALUAMOS SI ESTA SE HA REALIZADO CORRECTAMENTE
        if (saveCharacter) {
          // si se ha actualizado ----> borro la foto antigua de cloudinary
          // envio la respuesta con un 200
          deleteImgCloudinary(oldImg);
          return res.status(200).json(await Character.findById(id));
        } else {
          // si no se ha actualizado entonces mando una respuesta con un 404 diciendo que no se ha actualizado
          return res.status(404).json("Dont save character");
        }
  
        //! SI NO EXISTE ME LANZAS UN ERROR AL USUARIO POR LA RESPUESTA
      } else {
        // si no he encontrado por id---> mando una respuesta 404 que no se ha encontrado
        return res.status(404).json(FAIL_SEARCHING_CHARACTER_BY_ID);
      }
    } catch (error) {
      //! IMPORTANTE--> si el character no se encontro o hay cualquier otro error capturado la foto se ha subido antes porque esta en el middleware
      //! por lo cual hay borrarla para no tener basura dentro de nuestro cloudinary
      if (req.file) {
        //! le pasamos el req.file.path que incluye la url de cloudinary
        deleteImgCloudinary(catchImg);
      }
  
      // por ultimo lanzamos el errror que se guardara en el log del backend
      return next(error);
    }
};

// const updateCharacter = async (req, res, next) => {
//   //! capturo la url para si luego la tengo que borrar y le pongo el 
//   // optional chaining (?) para que no me rompa en caso que no tenga 
//   // la clave path
//   let catchImg = req.file?.path 

//   try {
//     const { id } = req.params

//     /// vamos a buscar que exista este character en la base de datos
//     const characterById = await Character.findById(id)

//     /// guardamos la url de la imagen antigua
//     const oldImg = characterById.image

//     //! SI EXISTE ESTE CHARACTER ENTONCES ME HACES LA LOGICA DEL UPDATE
//     if (characterById) {
//       // Me instancio un nuevo objeto del modelo Character
//       //const patchCharacter = new Character(req.body);
//       const patchCharacter = copyCharacter(req.body)

//       //! IMPORTANTE --> METER EL ID ANTIGUO PARA QUE NO CAMBIE
//       patchCharacter._id = id;

//       // si he recibido un archivo se lo meto en la clave image
//       if (req.file) {
//         patchCharacter.image = req.file.path;
//       } else {
//         // si no lo recibo me quedo con el antiguo
//         patchCharacter.image = oldImg;
//       }

//       // HACEMOS LA QUERY DE MONGOOSE DE ENCONTRAR POR ID Y ACTUALIZAR
//       const saveCharacter = await Character.findByIdAndUpdate(
//         id,
//         patchCharacter
//       );
//       // EVALUAMOS SI ESTA SE HA REALIZADO CORRECTAMENTE
//       if (saveCharacter) {
//         // si se ha actualizado ----> borro la foto antigua de cloudinary
//         // envio la respuesta con un 200
//         deleteImgCloudinary(oldImg);
//         return res.status(200).json(await Character.findById(id));
//       } else {
//         // si no se ha actualizado entonces mando una respuesta con un 404 diciendo que no se ha actualizado
//         return res.status(404).json("Dont save character");
//       }

//       //! SI NO EXISTE ME LANZAS UN ERROR AL USUARIO POR LA RESPUESTA
//     } else {
//       // si no he encontrado por id---> mando una respuesta 404 que no se ha encontrado
//       return res.status(404).json(FAIL_SEARCHING_CHARACTER_BY_ID);
//     }
//   } catch (error) {
//     //! IMPORTANTE--> si el character no se encontro o hay cualquier otro error capturado la foto se ha subido antes porque esta en el middleware
//     //! por lo cual hay borrarla para no tener basura dentro de nuestro cloudinary
//     if (req.file) {
//       //! le pasamos el req.file.path que incluye la url de cloudinary
//       deleteImgCloudinary(catchImg);
//     }

//     // por ultimo lanzamos el errror que se guardara en el log del backend
//     return next(error);
//   }
// };

//! ---------------------------------------------------------------------
//? ----------------------------- DELETE --------------------------------
//! ---------------------------------------------------------------------

const deleteCharacter = async (req, res, next) => {
  try {
    // We get the id from params
    const { id } = req.params;

     // We find by Id and remove it
    const deleteCharacter = await Character.findByIdAndDelete(id);

    // deleteCountry contains the removed element,
    // but sometimes dosen't work, so watch out!
    if (deleteCharacter) {
      // We check if the deleted element is in the DB,
      // if don't, we remove the image from Cloudinary
      // if the element was not remove, we call next and finish the execution
      if (await Character.findById(id)) {
        // The character is still in the DB, so something went wrong
        // and we didn't delete it!
        // We can't do anything else, just report it!
        next(FAIL_DELETING_CHARACTER);
      } else {
        // The character was removed successfully!

        // delete image from cloudinary
        deleteImgCloudinary(deleteCharacter.image);

        // Update the Movie collection, but just the characters with the 
        // Id id
        await Movie.updateMany(
          { characters: id }, // filter elements to update them
          {
            // pull removes the elements
            // that math the filter { characters: id },
            $pull: { characters: id }, 
          }
        )
      }

      // If everithhing went ok, we return a 200 Ok.
      // Just in case, we realize a test to check if the movie character 
      // was removed correctly
      return res.status(200).json({
        deleteObject: deleteCharacter,
        test: (await Character.findById(id)) ? "Movie characer NOT deleted" : "movie character deleted",
      });
    } else {
      return res.status(404).json("Movie character not found! Delete error!");
    }
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  create,
  getAll,
  getById,
  getByName,
  updateCharacter,
  deleteCharacter,
}
