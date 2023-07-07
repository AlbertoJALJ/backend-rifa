const mongoose = require("./db");
const Schema = mongoose.Schema;

const Creds = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("creds", Creds);
