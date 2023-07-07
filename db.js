const mongoose = require("mongoose")
require("dotenv").config();
const dbUri = process.env.db;

const dbConnect = async () => {
    try {
        mongoose.connect(dbUri);
        console.log("Conectado correctamente a MongoDB");
    } catch (error) {
        console.log("Fallo de conexión a MongoDB", error);
    }
};
dbConnect();
module.exports = mongoose;
