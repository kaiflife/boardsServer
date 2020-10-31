const jwt = require('jsonwebtoken');


//(?=.*\d)          // should contain at least one digit
//     (?=.*[a-z])       // should contain at least one lower case
//     (?=.*[A-Z])       // should contain at least one upper case
//     [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
//     $/

module.exports = {
  validatePassword(password){
    const regular = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    return regular.test(password);
  },
  
  validateFullName(fullName){
    const regName = /^[a-zA-Z]+ [a-zA-Z]+$/
    return regName.test(fullName);
  },
  
  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  
  validateToken(authorization) {
    return jwt.verify(
      authorization.split(' ')[1],
      process.env.AUTH_TOKEN,
      (err, payload) => {
        if (err) return { err };
        return { payload };
      }
    );
  },
}