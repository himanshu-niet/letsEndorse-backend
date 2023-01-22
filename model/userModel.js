const mongoose=require('mongoose');
const bcrypt = require("bcryptjs");


const userSchema = mongoose.Schema({

  e_fullname: {
    type: String,
    required: true,
  },
  e_email: {
    type: String,
    required: true,
    unique:true
  },
  e_mobile: {
    type: String,
    required: true,
  },
  h_password: {
    type: String,
    required: true,
  },
});





const User=new mongoose.model("User",userSchema);


module.exports=User;