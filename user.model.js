const mongoose = require("./db");
const Schema = mongoose.Schema;

const Usuario = new Schema({
  nombre_completo: String,
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  telefono: {
    type: String,
    required: true,
    unique: true,
  },
  numero_boleto: {
    type: String,
    required: true,
    unique: true,
  },
});
module.exports = mongoose.model("usuario", Usuario);
