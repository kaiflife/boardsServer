const jwt = require('jsonwebtoken');

module.exports = {
  validatePassword(password){
    return password.match(/[a-z]/g)
      && password.match(/[A-Z]/g) && password.match(/[0-9]/g)
      && password.match(/[^a-zA-Z\d]/g) && password.length >= 8;
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