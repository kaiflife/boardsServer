const jwt = require('jsonwebtoken');

const validatePassword = (password) => {
    return password.match(/[a-z]/g)
        && password.match(/[A-Z]/g) && password.match(/[0-9]/g)
        && password.match(/[^a-zA-Z\d]/g) && password.length >= 8;
}

const validateFullName = (fullName) => {
 const regName = /^[a-zA-Z]+ [a-zA-Z]+$/
 return regName.test(fullName);
}

const validateEmail = (email) => {
 const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 return re.test(email);
}

const validateToken = (authorization) => {
    return jwt.verify(
        authorization.split(' ')[1],
        process.env.AUTH_TOKEN,
        (err, payload) => {
            if (err) return { err };
            return { payload };
        }
    );
}

export {
 validateToken,
 validateEmail,
 validatePassword,
 validateFullName,
}