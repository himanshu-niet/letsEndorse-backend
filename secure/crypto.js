const crypto=require('crypto')

const algorithm='aes256';
const key = "j|(;wI.!l:h|!)k";


const encryptData=(text)=>{

   var cipher = crypto.createCipher(algorithm, key);
   var crypted = cipher.update(text, "utf8", "hex");
   crypted += cipher.final("hex");
   return crypted;
}


const decryptData =(text) => {
    try {
         var decipher = crypto.createDecipher(algorithm, key);
         var dec = decipher.update(text, "hex", "utf8");
         dec += decipher.final("utf8");
         return dec;
    } catch (error) {
        return null
    }
};

  module.exports = {
    encryptData,
    decryptData,
  };