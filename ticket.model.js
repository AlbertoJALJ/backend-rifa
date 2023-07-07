const mongoose = require("./db");
const Schema = mongoose.Schema;

const Boleto = new Schema({
  disponible: {
    default: true,
    type: Boolean,
  },
  numero_boleto: {
    index: true,
    type: Number,
    unique: true,
  },
});
module.exports = mongoose.model("boleto", Boleto);
