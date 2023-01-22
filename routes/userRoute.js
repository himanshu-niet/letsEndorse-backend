const router=require("express").Router();
const authenticateToken = require("../middleware/token");


const {
  signup,
  signin,
  resetPassword,
  updateUser,
  getUser,
} = require("../controller/userController");

router.get("/",authenticateToken, getUser);
 
router.post("/signup",  signup);

router.post("/signin", signin);

router.post("/reset",authenticateToken, resetPassword);

router.post("/update",authenticateToken, updateUser);




module.exports=router;