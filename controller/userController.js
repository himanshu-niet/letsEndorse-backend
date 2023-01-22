const {StatusCodes} = require("http-status-codes");
const bcrypt=require('bcryptjs')
const {encryptData,decryptData}=require("../secure/crypto")
const UserModel=require('../model/userModel')
const validateEmail =require("../secure/email")
const jwt = require("jsonwebtoken");


const signup =async (req, res) => {
try {
      const { fullname, email, mobile, password } = req.body;
      if ((!fullname, !email, !mobile, !password, !validateEmail(email))) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Request Body Error" });
      }
      const h_password=await bcrypt.hash(password,10);
      const e_fullname=encryptData(fullname);
      const e_email=encryptData(email);
      const e_mobile=encryptData(mobile);

  const user1 = await UserModel.findOne({ e_email });
  if (user1) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User already registered",
    });
  }

      const user=new UserModel({e_fullname,e_email,e_mobile,h_password});
      await user.save();

      res.status(201).json({ message: "Registration Successful" });

    } catch (error) {
 res.status(StatusCodes.BAD_REQUEST).json({message:"Registration Unsuccessful"})   
}
};


const signin =async (req, res) => {
  try {
    var {email, password } = req.body;

    const e_email = encryptData(email);

    console.log(e_email)
    if (!email, !password) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ message: "Request Body Error" });
    }

    const user = await UserModel.findOne({ e_email });
 
    if (user) {
      const { _id, e_email,e_fullname, e_mobile,h_password } = user;

      const isOk= await bcrypt.compare(password,h_password);
      
  
      if (isOk) {

       var fullname=decryptData(e_fullname);
       var email=decryptData(e_email);
       var mobile=decryptData(e_mobile);
     

   const token = jwt.sign({ _id:_id, email:email, mobile:mobile }, process.env.JWT_SECRET, {
     expiresIn: "30d",
   });    
          console.log(token);
        res.status(StatusCodes.OK).json({
          token,
          user: { _id, fullname,email,mobile },
        });

      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Password wrong!",
        });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "User does not exist..!",
      });
    }

  } catch (error) {
    res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ message: "Technical Error" });
  }
};



const resetPassword = async(req, res) => {
  try {
    const { old_password, new_password } = req.body;
    var {email}=req.user;
  
  
    if ((!old_password, !new_password, !email)) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ message: "Request Body Error" });
    }
        var e_email = encryptData(email);

       const user = await UserModel.findOne({ e_email });
 
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND)

    }
      const { h_password } = user;

      const isOk= await bcrypt.compare(old_password,h_password);


      if (isOk) {   

        const new_h_password = await bcrypt.hash(new_password, 10);

       const change = await UserModel.updateOne(
         { e_email: e_email },
         { $set: { h_password: new_h_password } }
       );

       if (change.modifiedCount == 0) {
         return res.status(StatusCodes.NOT_FOUND).json({
           message: "Password Not Change",
         });
       } else {
         return res
           .status(StatusCodes.OK)
           .json({ message: "Password Update Successfully" });
       }
      

      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Old Password Not Matched",
        });
      }
      } catch (error) {
    res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ message: "Technical Error" });
  }
};


const updateUser=async(req,res)=>{
    
try {
  const { fullname, mobile } = req.body;

 var { email } = req.user;

  if (!fullname,  !mobile) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ message: "Request Body Error" });
  }
       var e_email = encryptData(email);

       const user = await UserModel.findOne({ e_email });
 
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND)

    }
    
        const e_fullname=encryptData(fullname)
        const e_mobile=encryptData(mobile)

       const change = await UserModel.findOneAndUpdate(
         { e_email: e_email },
         { $set: { e_fullname: e_fullname, e_mobile: e_mobile } }
       );

       if (change.modifiedCount == 0) {
         return res.status(StatusCodes.NOT_FOUND).json({
           message: "User Data Not Update",
         });
       } else {
         return res
           .status(StatusCodes.OK)
           .json({ message: "User Data Update Successfully",user:{email,fullname,mobile} });
       }
      

} catch (error) {
  res
    .status(StatusCodes.SERVICE_UNAVAILABLE)
    .json({ message: "Technical Error" });
}
}


const getUser = async (req, res) => {
  try {
      var { email } = req.user;
    var e_email = encryptData(email);

    const user = await UserModel.findOne({ e_email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND);
    }

    const fullname = decryptData(user.e_fullname);
     const mobile = decryptData(user.e_mobile);
   
     res.status(StatusCodes.OK).json({user:{email,fullname,mobile}})

  } catch (error) {
    res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ message: "Technical Error" });
  }
};




module.exports = {
  signup,
  signin,
  resetPassword,
  updateUser,
  getUser,
};
