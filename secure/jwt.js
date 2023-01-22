const jwt = require("jsonwebtoken");
require("dotenv").config();

const token = jwt.sign({ him:"hima" }, process.env.JWT_SECRET, {
  expiresIn: "30d",
});

console.log(token)