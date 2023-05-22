const mongoose = require("mongoose");

// Types of our data model
// We create the data model
// 1. type: data type ('string, number, ...)
// 2. required: if the data is required or not
const MovieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    characters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character" }],
  },
  {
    timestamps: true,
  }
)

// we create the data schema model for mongoose
const Movie = mongoose.model("Movie", MovieSchema)
module.exports = Movie
