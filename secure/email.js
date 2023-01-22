
function validateEmail(email)
{
   
var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

if(!email.match(emailformat))
{
return false
}
return true
}

module.exports = validateEmail;