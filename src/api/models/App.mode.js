const mongoose = require("mongoose");

// Types of our data model
const Schema = mongoose.Schema;


// We create the data model
// 1. type: data type ('string, number, ...)
// 2. required: if the data is required or not
const AppSchema = new Schema(
  {
    appName:  { type: String, required: true, unique: true },
    category:  { // Categorias d elas aplicaciones
        type: String,
        enum: ["Business",
            "Communications",
            "Entertainment",
            "Social",
            "Shopping",
            "Education"
        ],
        required: true,
    },
    languages: { type: String, required: true }, // lenguaje de la aplicación
    appSize: { type: Number, required: true }, // tamaño en MBs de la app
    mobileDevs: { //  Referencia al modelo de dato de los MobilesDev
      type: [mongoose.Schema.Types.ObjectId],
      ref: "MobileDev", 
      required: true
    },
  },
  {
    timestamps: true,
  }
)

// we create the data schema model for mongoose
const App = mongoose.model("App", AppSchema)

module.exports = App
