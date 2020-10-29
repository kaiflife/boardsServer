import {validateEmail, validatePassword, validateToken} from "../../helpers/validator";
const Users = require('../../models/users');

const tokenKey = 'nodeauthsecret';

module.exports = {
    auth(req, res, next) {
        const { email, password } = req;
    
        Users.findOne({where: {email}})
         .then(user => {
             let head = Buffer.from(
              JSON.stringify({ alg: 'HS256', typ: 'jwt' })
             ).toString('base64')
             let body = Buffer.from(JSON.stringify(user)).toString(
              'base64'
             )
             let signature = crypto
              .createHmac('SHA256', tokenKey)
              .update(`${head}.${body}`)
              .digest('base64')
    
             return res.status(200).json({
                 id: user.id,
                 login: user.login,
                 token: `${head}.${body}.${signature}`,
             })
         }).catch( err => console.log(err) );

        return res.status(404).json({ message: 'User not found' })
        
        const authorization = req.headers.authorization;
        if(authorization) {
            const { payload, err } = validateToken(authorization);
            if (err) next()
            else if (payload) {
                const { userId } = payload;
                for (let user of Users) {
                    if (user.id === userId) {
                        req.user = user
                        next()
                    }
                }

                if (!req.user) next()
            }
        }
    },
    
    update(req, res, next) {
        
        const { fullName, email, password } = req;
    
        if(!validatePassword(password)) {
            return res.status(400).json('password instructions');
        }
        if(validateFullName(fullName)) {
            return res.status(400).json('fullname instructions');
        }
        if(validateEmail(email)) {
            return res.status(400).json('email instructions');
        }
        
        const [ firstName, lastName ] = fullName.join(' ' );
        
        const id = validateToken(req.headers.authorization);
        
        const updatedData = {};
        if(firstName) updatedData.firstName = firstName;
        if(lastName) updatedData.lastName = lastName;
        if(password) updatedData.password = password;
        if(email) updatedData.email = email;
        
        Users.update(updatedData,
         {where: {id}}
        )
         .then((res) => res.send.status(200));
    },

    registration(req, res) {
        const { fullName, password, email } = req;
        const { err, payload } = validateToken(req.headers.authorization);
        if(err || !payload) {
            return res.send.status(401).json('Invalid token');
        }
    
        if(!validatePassword(password)) {
            return res.status(400).json('password instructions');
        }
        if(validateFullName(fullName)) {
            return res.status(400).json('fullname instructions');
        }
        if(validateEmail(email)) {
            return res.status(400).json('email instructions');
        }
        
        const [firstName, lastName] = fullName.join(' ');
    
        Users.findOne({where: {email}})
         .then(user => {
             if(user.email === email) {
                 return res.status(403).json('email already exist');
             }
         }).catch(err=>console.log(err));
    
        Users.create({
            firstName,
            lastName,
            email,
            password,
        })
         .then( res => res.send.status(201))
         .catch( err => console.log(err));
    },
    
    delete(req, res, next) {
    
    }
}