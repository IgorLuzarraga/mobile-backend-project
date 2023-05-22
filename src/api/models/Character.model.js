const mongoose = require("mongoose");

// Types of our data model
const Schema = mongoose.Schema;

// // We create the data model
// // 1. type: data type ('string, number, ...)
// // 2. required: if the data is required or not
// const CharacterSchema = new Schema(
//   {
//     name: { type: String, required: false, unique: true },
//     gender: {
//       type: String,
//       enum: ["female", "male", "fluid"],
//       required: false,
//     },
//     image: { type: String },
//     movie: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
//   },
//   {
//     timestamps: true,
//   }
// )

// We create the data model
// 1. type: data type ('string, number, ...)
// 2. required: if the data is required or not
const CharacterSchema = new Schema(
  {
    name: { type: String, required: false, unique: true },
    gender: {
      type: String,
      enum: ["female", "male", "fluid"],
      required: false,
    },
    image: { type: String },
    movies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Movie", 
      required: true
    },
  },
  {
    timestamps: true,
  }
)

// we create the data schema model for mongoose
const Character = mongoose.model("Character", CharacterSchema)

module.exports = Character
